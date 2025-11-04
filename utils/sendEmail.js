const nodemailer = require("nodemailer")

async function sendEmail (to, subject, htmlContent) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  })

  const mailOptions = {
    from: `"ESMS" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: htmlContent,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log("Email sent successfully", to)
  } catch (error) {
    console.log("Error sending email:", error)
  }
}

module.exports = sendEmail