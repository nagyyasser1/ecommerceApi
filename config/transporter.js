import { createTransport } from "nodemailer";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: "nagyy8751@gmail.com",
    pass: "qdbc swvm fmkh ixgz",
  },
});

export default transporter;
