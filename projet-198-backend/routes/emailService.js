const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  
  port: +process.env.SMTP_PORT,
  secure: true, // true for port 465, false for 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Generate a secure raw token (e.g. for email verification)
function generateRawToken() {
  return crypto.randomBytes(32).toString('hex'); // 64-char random token
}

// Hash a token (to store securely in DB)
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Send a verification email with raw token in the URL
async function sendVerificationEmail(email, token) {
  const verifyUrl = `${process.env.APP_URL}/users/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"My App" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Please verify your email',
    html: `
      <p>Thanks for signing up! Click <a href="${verifyUrl}">here</a> to verify your address.</p>
      <p>If that link doesn’t work, copy & paste: ${verifyUrl}</p>
    `,
  });
}

module.exports = {
  generateRawToken,
  hashToken,
  sendVerificationEmail,
};