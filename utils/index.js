const { createJWT, isTokenValid, attachCookiesToResponse } = require("./jwt");
const createTokenUser = require("./createTokrnUser");

const checkPermissions = require("./checkPermissions");
const sendVerficationEmail = require("./sendVerficationEmail");
const sendEmail = require("./sendEmail");



module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
  sendVerficationEmail,
  sendEmail
};
