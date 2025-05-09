const crypto     = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('ENV CHECK:', {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,
});

// Generates a 6-digit numeric token
function generateVerificationToken() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationEmail(email, token) {
 
  await transporter.sendMail({
    from:    `"My App" <${process.env.SMTP_USER}>`,
    to:       email,
    subject:  'Kys nigger',
    html:     `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <h2 style="color: #4CAF50;">Welcome to My App!</h2>
        <p>Thank you for signing up nigger! Use the code below to verify your email:</p>
        <p style="font-size: 24px; font-weight: bold; color:rgb(175, 76, 76);">${token}</p>
        <p>If you did not sign up, ignore this email.</p>
      </div>
    `,
  });
}

async function sendPasswordResetEmail(email, token) {
  
  await transporter.sendMail({
    from:    `"198" <${process.env.SMTP_USER}>`,
    to:       email,
    subject:  'Reset your password',
    html:     `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <h2 style="color: #f39c12;">Password Reset Request</h2>
        <p>Use the code below to set a new password:</p>
        <p style="font-size: 24px; font-weight: bold; color:rgb(243, 18, 18);">${token}</p>
        <p>If you did not request this, ignore this email.</p>
      </div>
    `,
  });
}

module.exports = {
  generateVerificationToken,       // ← renamed
  sendVerificationEmail,
  sendPasswordResetEmail,
};