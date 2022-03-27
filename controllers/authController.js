const User = require("../models/User");
const Token = require("../models/Token");
const { StatusCodes } = require("http-status-codes");
const CusttomError = require("../errors");
const {
  attachCookiesToResponse,
  createTokenUser,
  sendVerficationEmail,
  sendResetPasswordEmail,
  createHash,
} = require("../utils");
const crypto = require("crypto");
const { findOne } = require("../models/User");

const register = async (req, res) => {
  const { email, name, password } = req.body;
  const emailAlreadyExists = await User.findOne({ email });

  if (emailAlreadyExists) {
    // console.log(CusttomError);
    throw new CusttomError.BadRequestError("Email already exists");
  }

  //first redistered user is an administ
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await User.create({
    email,
    name,
    password,
    role,
    verificationToken,
  });

  const origin = "http://localhost:3000";

  // const protocol = req.protocol;
  // console.log(`protocol: ${protocol}`);
  // const host = req.get("host");
  // console.log("host" + host);

  // const forwardeHost = req.get("x-forwarded-host");
  // const forwardeProtocol = req.get("x-forwarded-proto");
  // console.log(`forwardeHost: ${forwardeHost}`);
  // console.log(`forwardeProtocol: ${forwardeProtocol}`);

  await sendVerficationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });
  ///send verification token back only whilr testing in postmane||
  res.status(StatusCodes.CREATED).json({
    msg: "success! please check your email to verify account",
  });

  // const tokenUser = createTokenUser(user);
  // attachCookiesToResponse({ res, user: tokenUser });
  // res.status(StatusCodes.CREATED).json({ user: tokenUser });

  //   res.send("register user");
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new CusttomError.UnauthenticatedError("verification Failed");
  }

  if (user.verificationToken !== verificationToken) {
    throw new CusttomError.UnauthenticatedError("verification Failed");
  }

  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Email Verified" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CusttomError.BadRequestError("please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CusttomError.UnauthenticatedError("Invalid Credentials");
  }

  if (!user.isVerified) {
    throw new CusttomError.UnauthenticatedError("plz verified a email");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CusttomError.UnauthenticatedError("Invalid Credentials");
  }

  const tokenUser = createTokenUser(user);

  //create refresh token
  let refreshToken = "";

  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new CusttomError.UnauthenticatedError("Invalid Credentials");
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString("hex");

  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };
  await Token.create(userToken);
  //check for existing token

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ user: tokenUser });
  // res.send(req);
};

const logout = async (req, res) => {
  await Token.findOneAndDelete({
    user: req.user.userId,
  });

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: "user logged out" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    // console.log(CusttomError);
    throw new CusttomError.BadRequestError("Please Provid valid email");
  }

  const user = await User.findOne({ email: email });

  if (user) {
    const passwordToken = crypto.randomBytes(70).toString("hex");

    // send email

    const origin = "http://localhost:3000";

    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    });

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "Please check your email for reser password link" });
};

const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;
  console.log(password);

  if (!token || !email || !password) {
    throw new CusttomError.BadRequestError("Please Provid all values");
  }

  const user = await User.findOne({ email });

  if (user) {
    const currentDate = new Date();

    if (
      user.passwordToken === createHash(token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
    }
  }

  res.send("resetPassword");
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  resetPassword,
  forgotPassword,
};
