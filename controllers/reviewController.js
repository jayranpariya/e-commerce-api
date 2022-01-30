const Review = require("../models/Review");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const {
  checkPermissions,
} = require("../utils");

const createReview = async (req, res) => {
  const { product: productId } = req.body;

  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`no product with id ${productId}`);
  }

  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });

  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      "already Submitted review for this product"
    );
  }

  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate({ path: "product", select: "name company price" })
    .populate({ path: "user", select: "name " });
  res.status(StatusCodes.OK).json({ reviews, const: reviews.length });
};
const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Review.findOne({
    _id: reviewId,
  });
  if (!review) {
    throw new CustomError.NotFoundError(
      `this id review is not found ${req.params.id}`
    );
  }
  res.status(StatusCodes.OK).json({ review });
};
const updateReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;

  if (!rating || !title || !comment) {
    throw new CustomError.BadRequestError(
      "please provide rating , title or comment"
    );
  }

  const review = await Review.findById({
    _id: reviewId,
  });
  if (!review) {
    throw new CustomError.NotFoundError(
      `this id review is not found ${req.params.id}`
    );
  }
  checkPermissions(req.user, review.user);
  review.rating = rating;
  review.comment = comment;
  review.title = title;
  await review.save();
  res.status(StatusCodes.OK).json({ review });
};
const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const reviewdelete = await Review.findOne({ _id: reviewId });
  if (!reviewdelete) {
    throw new CustomError.NotFoundError(
      `this id review is not found ${req.params.id}`
    );
  }
  checkPermissions(req.user, reviewdelete.user);
  await reviewdelete.remove();
  res.status(StatusCodes.OK).json({ msg: "Success review Removed" });
};

const getsingleproductreview = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, const: reviews.length });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getsingleproductreview,
};
