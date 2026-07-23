import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Define message options
  const message = {
    from: process.env.EMAIL_FROM || 'Espacio Interiors <noreply@theespacio.in>',
    to: options.email,
    subject: options.subject,
    html: options.html,
    attachments: options.attachments || [],
  };

  // Send mail
  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

export default sendEmail;
