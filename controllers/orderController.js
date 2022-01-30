const Order = require("../models/Order");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

const fakeStripeApi = async ({ amount, currency }) => {
  const client_secret = "sdadbhvbjhsbjbcjhbdcjhdbsjcb";
  return { client_secret, amount };
};

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError("No cart item provided");
  }

  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError("please provide tax and shipping");
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `no product with id : ${item.product}`
      );
    }
    const { name, price, image, _id } = dbProduct;
    const SingleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    orderItems = [...orderItems, SingleOrderItem];
    //subtotale
    subtotal += item.amount * price;
  }
  const total = subtotal + tax + shippingFee;
  //get client secret
  const paymentIntent = await fakeStripeApi({
    amount: total,
    currency: "usd",
  });

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};
const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders });
};
const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;

  const order = await Order.findById({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(
      `no order is avalabale of this ${orderId}`
    );
  }
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const userId = req.user.userId;
  const CurrentUserOrders = await Order.find({
    user: userId,
  });
  if (!CurrentUserOrders) {
    throw new CustomError.NotFoundError("no order is avalable of this user");
  }
  res.status(StatusCodes.OK).json({ CurrentUserOrders });
};
const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`no order with id : ${orderId}`);
  }
  checkPermissions(req.user, order.user);
  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await order.save();
  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
