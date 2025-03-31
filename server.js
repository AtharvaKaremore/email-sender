const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();
const app = express();
app.use(express.json()); // Middleware to parse JSON

app.post("/send-email", async (req, res) => {
    try {
        const { to, subject, message } = req.body;

        if (!to || !subject || !message) {
            return res.status(400).json({ error: "Missing fields in request" });
        }

        // Setup Nodemailer (Using Gmail SMTP)
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass:  process.env.PASSWORD, // Use an App Password, NOT your real password
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

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
