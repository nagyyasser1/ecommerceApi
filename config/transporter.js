import { createTransport } from "nodemailer";

const transporter = createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "nagyy8751@gmail.com",
    pass: "qdbc swvm fmkh ixgz",
  },
});

export default transporter;
