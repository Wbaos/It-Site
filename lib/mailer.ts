import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendResetEmail(to: string, resetUrl: string) {
  const mailOptions = {
    from: `"CareTech Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset your password",
    html: `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">Reset Password</a>
      <p>This link will expire in 15 minutes.</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}
