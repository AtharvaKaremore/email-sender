const express = require("express");
const cors = require("cors"); // ✅ Import CORS
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// ✅ Allow frontend to make requests
app.use(cors({
    origin: "*", // Allow all origins (for testing) ✅ Change to specific domain later
    methods: ["POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json()); // Enable JSON parsing

app.post("/send-email", async (req, res) => {
    try {
        const { to, subject, message } = req.body;

        if (!to || !subject || !message) {
            return res.status(400).json({ error: "Missing fields in request" });
        }

        // Nodemailer setup with Gmail SMTP
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD, // Use an App Password
            },
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL,
            to: to,
            subject: subject,
            text: message,
        };

        // Send Email
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Email sent successfully!" });

    } catch (error) {
        console.error("Email sending error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Fix: Use Render-assigned port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
