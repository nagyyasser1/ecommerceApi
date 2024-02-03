import transporter from "../config/transporter.js";

function sendEmail({ to, from, subject, text, html }) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      to,
      from,
      subject,
      text,
      html,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info.response);
        l;
      }
    });
  });
}

export default sendEmail;
