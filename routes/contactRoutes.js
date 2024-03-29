import verifyJWT from "../middlewares/verifyJWT.js";
import STATUS_CODES from "../constants/STATUS_CODES.js";
import { Router } from "express";
import sendEmail from "../utils/sendMail.js";
import htmlContent from "../utils/htmlContent.js";
const router = Router();

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Submit a contact form
 *     description: Submit a contact form with name, email, and message. Requires authentication with a valid token.
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the person submitting the form
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the person submitting the form
 *                 example: john@example.com
 *               message:
 *                 type: string
 *                 description: Message content
 *                 example: This is a sample message.
 *     responses:
 *       '200':
 *         description: Message sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Message sent successfully
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */

router.post("/", verifyJWT, (req, res) => {
  // Extract data from the request body
  const { name, email, message, subject } = req.body;

  if (!name || !email || !message || !subject) {
    return res.status(STATUS_CODES.BAD_REQUEST).json({
      message: "All fields are required! {name, email, message, subject}",
    });
  }

  // Set up email options
  const mailOptions = {
    from: email,
    to: process.env.MY_EMAIL,
    subject: subject,
    text: message,
    html: htmlContent({ name, email, subject, message }),
  };

  sendEmail(mailOptions)
    .then((response) => {
      console.log("Email sent:", response);
      res.json({ success: true, message: "Message sent successfully" });
    })
    .catch((err) => {
      console.error("Error:", err);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    });
});

export default router;
