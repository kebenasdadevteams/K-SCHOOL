const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendPasswordResetEmail = async (toEmail, resetLink, fullName) => {
  const mailOptions = {
    from: `"K-School | Kebena Church" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Reset Your K-School Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: Georgia, serif; background: #0f0f0f; color: #e5e5e5; margin: 0; padding: 0; }
            .wrapper { max-width: 560px; margin: 40px auto; background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 12px; overflow: hidden; }
            .header { background: #111; border-bottom: 1px solid #2a2a2a; padding: 32px; text-align: center; }
            .header h1 { font-size: 22px; color: #f59e0b; margin: 0; letter-spacing: 0.15em; text-transform: uppercase; }
            .header p { color: #666; font-size: 12px; margin: 6px 0 0; letter-spacing: 0.1em; text-transform: uppercase; }
            .body { padding: 36px 32px; }
            .body p { line-height: 1.7; color: #aaa; font-size: 15px; margin: 0 0 16px; }
            .body p strong { color: #e5e5e5; }
            .btn { display: inline-block; margin: 24px 0; background: #f59e0b; color: #000 !important; text-decoration: none; font-weight: bold; font-size: 15px; padding: 14px 32px; border-radius: 8px; letter-spacing: 0.05em; }
            .note { font-size: 13px; color: #555; border-top: 1px solid #2a2a2a; padding-top: 20px; margin-top: 8px; }
            .footer { background: #111; border-top: 1px solid #2a2a2a; padding: 20px 32px; text-align: center; }
            .footer p { color: #444; font-size: 12px; margin: 0; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="header">
              <h1>K-School</h1>
              <p>Kebena Church Learning Platform</p>
            </div>
            <div class="body">
              <p>Hello <strong>${fullName}</strong>,</p>
              <p>We received a request to reset the password for your K-School account. Click the button below to set a new password:</p>
              <div style="text-align:center;">
                <a href="${resetLink}" class="btn">Reset My Password</a>
              </div>
              <p>This link will expire in <strong>1 hour</strong>.</p>
              <p class="note">If you did not request a password reset, you can safely ignore this email. Your password will not be changed.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Kebena Church · K-School</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendPasswordResetEmail };
