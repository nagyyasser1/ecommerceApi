const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nagyy8751@gmail.com",
    pass: "qdbc swvm fmkh ixgz",
  },
});

module.exports = transporter;
