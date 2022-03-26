const sendEmail = require("./sendEmail");

const sendVerficationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;

  const msg = `
    <p>Plz confirm your email by clicking on the foolowing link : <a href="${verifyEmail}">Verify Email</a></p>
    
    `;
  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `
        <h4>Helllo , ${name}</h4>
        ${msg}
        `,
  });
};

module.exports = sendVerficationEmail;
