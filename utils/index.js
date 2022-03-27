const { createJWT, isTokenValid, attachCookiesToResponse } = require("./jwt");
const createTokenUser = require("./createTokrnUser");

const checkPermissions = require("./checkPermissions");
const sendVerficationEmail = require("./sendVerficationEmail");
const sendResetPasswordEmail = require("./sendResetPasswordEmail");
const sendEmail = require("./sendEmail");
const createHash = require("./createHash");

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
  sendVerficationEmail,
  sendEmail,
  sendResetPasswordEmail,
  createHash,
};
