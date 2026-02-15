const nodemailer = require('nodemailer');
const TelegramBot = require('node-telegram-bot-api');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { name, email, message } = req.body;

    // Initialize Telegram Bot
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    let bot;

    if (botToken && chatId) {
        bot = new TelegramBot(botToken, { polling: false });
    }

    // Create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Email options
    let mailOptions = {
        from: `"${name}" <${email}>`,
        to: 'gedu0194@gmail.com',
        subject: `New Contact Form Message from ${name}`,
        text: `You have a new message from your portfolio contact form:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `<p>You have a new message from your portfolio contact form:</p>
               <ul>
                 <li><b>Name:</b> ${name}</li>
                 <li><b>Email:</b> ${email}</li>
               </ul>
               <p><b>Message:</b></p>
               <p>${message}</p>`
    };

    try {
        await transporter.sendMail(mailOptions);

        if (bot && chatId) {
            const telegramMsg = `🚀 *New Contact Form Message*\n\n*Name:* ${name}\n*Email:* ${email}\n\n*Message:*\n${message}`;
            await bot.sendMessage(chatId, telegramMsg, { parse_mode: 'Markdown' });
        }

        return res.status(200).json({ message: 'Message sent successfully! Gedam will get back to you soon.' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Failed to send message.', error: error.message });
    }
}
