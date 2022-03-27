const sendEmail = require("./sendEmail");

const sendResetPasswordEmail = async ({ name, email, token, origin }) => {
  const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`;

  const msg = `
    <p>Plz reset password by clicking on the following link : <a href="${resetURL}">Reset Password</a></p>`;

  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: `
            <h4>Helllo , ${name}</h4>
            ${msg}
            `,
  });
};

module.exports = sendResetPasswordEmail;
