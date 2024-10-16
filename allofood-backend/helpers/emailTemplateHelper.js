const jwt = require("jsonwebtoken");
const { sendEmail } = require("./sendEmailHelper");

async function sendVerificationEmail(user, email, name) {
    // Generate a new token for email verification
    const userObject = { ...user._doc };
    delete userObject.password;
    const token = jwt.sign(userObject, process.env.TOKEN_SECRET, {
        expiresIn: 600, // 10 minutes
    });

    const queryParam = encodeURIComponent(token);
    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Account activation link",
        text: `Hello ${name},`,
        html: `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                <h3>🎉 Welcome to AlloMedia! 🎉</h3>
                <p>We're excited to have you on board. Please click the link below to activate your account:</p>
                <a href="${process.env.BACKEND_URL}/auth/activate?token=${queryParam}"
                   style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 16px; color: white; background-color: #DF2020; text-decoration: none; border-radius: 5px;">
                    🔓 Activate your account
                </a>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Thank you,</p>
                <p>The AlloMedia Team</p>
            </div>
        `,
    };

    await sendEmail(mailOptions);
}

module.exports = { sendVerificationEmail };