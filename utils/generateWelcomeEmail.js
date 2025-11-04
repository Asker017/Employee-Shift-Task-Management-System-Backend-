
const generateWelcomeEmail = (name) => `
  <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 10px; padding: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
      <h2 style="color: #4b0082;">Welcome to ESMS!</h2>
      <p style="font-size: 16px; color: #333;">
        Hi <strong>${name}</strong>,
      </p>
      <p style="font-size: 15px; color: #555;">
        We’re excited to have you onboard 🎉. You can now log in to your employee account,
        view your tasks and shifts easily.
      </p>
      <p style="font-size: 15px; color: #555;">
        Keep up the great work, and feel free to reach out to your admin for any help!
      </p>
      <div style="text-align: center; margin-top: 20px;">
        <a href="#" style="background-color: #4b0082; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
      </div>
      <p style="font-size: 13px; color: gray; margin-top: 30px; text-align: center;">
        © 2025 ESMS | All rights reserved
      </p>
    </div>
  </div>
`;

module.exports = generateWelcomeEmail
