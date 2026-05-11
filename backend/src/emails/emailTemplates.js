export const welcomeEmailTemplate = (username, websiteUrl) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
      
      <h2>Hi ${username},</h2>

      <p>
        Welcome to <strong>Chatify</strong> 🎉 <br/>
        We’re excited to have you join our community.
      </p>

      <p>
        Your account has been successfully created, and you’re now ready to start chatting with friends, connect with new people, and enjoy real-time conversations anytime, anywhere.
      </p>

      <h3>What you can do on Chatify:</h3>

      <ul>
        <li>💬 Instant real-time messaging</li>
        <li>📸 Share images and media</li>
        <li>👥 Connect with friends</li>
        <li>🔒 Secure and private chats</li>
      </ul>

      <p>
        Get started now and explore everything Chatify has to offer.
      </p>

      <p>
        👉 <a href="${websiteUrl}" target="_blank">Login to your account</a>
      </p>

      <p>
        If you have any questions or need help, feel free to reply to this email.
      </p>

      <p>
        Thanks for joining us! <br/>
        <strong>Team Chatify ❤️</strong>
      </p>

    </div>
  `;
};