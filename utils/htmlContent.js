const htmlContent = ({ name, email, subject, message }) => {
  return `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <p style="font-size: 18px; font-weight: bold;">Sender: ${name}</p>
            <p style="font-size: 16px;">Email: ${email}</p>
            <p style="font-size: 16px;">Subject: ${subject}</p>
            <hr style="border: 1px solid #ddd;">
            <p style="font-size: 16px;">Message:</p>
            <p style="font-size: 14px; line-height: 1.6;">${message}</p>
            </div>
        `;
};

export default htmlContent;
