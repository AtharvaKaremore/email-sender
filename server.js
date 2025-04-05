const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// ✅ Email Transporter Setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL || "your_email@gmail.com",
        pass: process.env.PASSWORD || "your_app_password"
    }
});

// ✅ CORS Middleware (Restrict to specific origin in production)
app.use(cors({
    origin: "*", // ⚠️ Change this to your frontend URL in production
    methods: ["POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json()); // 🔄 Parses incoming JSON requests

// ✅ API Route to Send Email
app.post('/send-email', async (req, res) => {
    try {
        const { to, subject, message, attachment } = req.body;

        // ✅ Basic validation
        if (!to || !subject || !message) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        const mailOptions = {
            from: `<${process.env.EMAIL}>`,
            to,
            subject,
            html: message,
            attachments: attachment ? [{
                filename: attachment.filename || 'attachment.pdf',
                content: Buffer.from(attachment.content, 'base64'),
                contentType: attachment.contentType || 'application/pdf'
            }] : []
        };

        const result = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", result.messageId);
        res.json({ message: "Email sent successfully!" });

    } catch (error) {
        console.error("❌ Email sending failed:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Server Setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
