const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Telegram Bot
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
let bot;

if (botToken && chatId && botToken !== 'your_bot_token_here') {
    bot = new TelegramBot(botToken, { polling: false });
    console.log('🤖 Telegram Bot initialized.');
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// POST route to handle contact form submission
app.post('/send', async (req, res) => {
    const { name, email, message } = req.body;

    console.log(`Received message from ${name} (${email}): ${message}`);

    // Create a transporter object using the default SMTP transport
    // [IMPORTANT] Update these settings with your own email provider details
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Email options
    let mailOptions = {
        from: `"${name}" <${email}>`, // sender address
        to: 'gedu0194@gmail.com', // list of receivers (Your email)
        subject: `New Contact Form Message from ${name}`, // Subject line
        text: `You have a new message from your portfolio contact form:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`, // plain text body
        html: `<p>You have a new message from your portfolio contact form:</p>
               <ul>
                 <li><b>Name:</b> ${name}</li>
                 <li><b>Email:</b> ${email}</li>
               </ul>
               <p><b>Message:</b></p>
               <p>${message}</p>` // html body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully!');

        // Send Telegram notification if bot is configured
        if (bot && chatId) {
            const telegramMsg = `🚀 *New Contact Form Message*\n\n*Name:* ${name}\n*Email:* ${email}\n\n*Message:*\n${message}`;
            await bot.sendMessage(chatId, telegramMsg, { parse_mode: 'Markdown' });
            console.log('📲 Telegram notification sent!');
        }

        res.status(200).send({ message: 'Message sent successfully! Gedam will get back to you soon.' });
    } catch (error) {
        console.error('❌ Error sending email:', error);

        let errorMsg = 'Failed to send message.';
        if (error.code === 'EAUTH') {
            errorMsg = 'Authentication failed. Please check your EMAIL_PASS (App Password) in .env file.';
        }

        res.status(500).send({ message: errorMsg, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
