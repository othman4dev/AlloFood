const { validateForms } = require("../validations/userformsValidation");
const { sendVerificationEmail } = require("../helpers/emailTemplateHelper");
const validateToken = require("../validations/tokenValidation");
const { sendEmail } = require("../helpers/sendEmailHelper");
const speakeasy = require("speakeasy");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/userModel");
const RoleModel = require("../models/roleModel");
require("dotenv").config();

async function register(req, res) {
  // user data Validation :
  const { error } = validateForms.validateRegister(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // Checking if the user is already in the database
  const emailExists = await UserModel.findOne({ email: req.body.email });
  if (emailExists)
    return res.status(400).json({ error: "Email already exists" });

  // fetch role ObjectId
  const role = await RoleModel.findOne({ name: req.body.role });
  if (!role) return res.status(400).json({ error: "Role does not exist" });

  // Hash passwords
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(req.body.password, salt);

  // Create a new user
  const user = new UserModel({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    role: role._id,
    phone: req.body.phone,
  });

  try {
    const savedUser = await user.save();
    await sendVerificationEmail(savedUser, req.body.email, req.body.name);

    res.status(201).json({
      success: "User registered successfully, verify your email",
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function activate(req, res) {
  // get token from url
  const token = req.query.token;
  if (!token) return res.status(401).json({ error: "Access denied" });

  // verify token
  const decoded_user = validateToken(token);
  if (!decoded_user.success)
    return res.status(401).json({ error: "Access denied, token invalid" });
  const _id = decoded_user.data._id;
  // update user
  try {
    const updatedUser = await UserModel.updateOne(
      { _id },
      { is_verified: true }
    );
    res.redirect(`${process.env.FRONTEND_URL}/login`);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Something went wrong" });
  }
}

async function shouldRequire2FA(user) {
  const lastLoginDate = user.lastLogin;
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  return (
    user.alwaysRequire2FA || (lastLoginDate && lastLoginDate < thirtyDaysAgo)
  );
}

async function login(req, res) {
  const { error } = validateForms.validateLogin(req.body);

  try {
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await UserModel.findOne({ email: req.body.email }).populate(
      "role"
    );
    if (!user)
      return res.status(400).json({ error: "Invalid email or password" });

    const validPass = await bcryptjs.compare(req.body.password, user.password);
    if (!validPass)
      return res.status(400).json({ error: "Invalid email or password" });

    if (!user.is_verified) {
      const emailSent = await sendVerificationEmail(
        user,
        req.body.email,
        user.name
      );
      return res.status(401).json({
        message:
          "Email verification pending. Check your inbox to complete the process",
      });
    }

    const require2FA = await shouldRequire2FA(user);

    if (require2FA) return sendOtp(req, res, user);
    else return generateTokenAndRespond(res, user);
    
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function sendOtp(req, res) {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = speakeasy.totp({
    secret: process.env.OTP_SECRET,
    encoding: "base32",
    step: 300,
  });

  const otpToken = jwt.sign(
    {
      userId: user._id,
      otpGeneratedAt: Date.now(),
    },
    process.env.OTP_TOKEN_SECRET,
    { expiresIn: "5m" }
  );

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: req.body.email,
    subject: "Your OTP Code",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #333;">Your OTP Code</h2>
        <p>Enter the following OTP code to complete the login process:</p>
        <p style="font-size: 1.5em; font-weight: bold; color: #000;">${otp}</p>
        <p>This code will expire in 5 minutes.</p>
        <p>If you did not request this code, please ignore this email.</p>
      </div>
    `,
  };

  await sendEmail(mailOptions);

  return res.status(200).json({
    success: "OTP sent to your email",
    otpToken,
    require2FA: true,
  });
}

async function verifyOtp(req, res) {
  const { otp, otpToken } = req.body;

  if (!otpToken)
    return res.status(400).json({ error: "OTP token is required" });

  let decoded;
  try {
    decoded = jwt.verify(otpToken, process.env.OTP_TOKEN_SECRET);
  } catch (error) {
    return res.status(400).json({ error: "Invalid or expired OTP token" });
  }

  const isValid = speakeasy.totp.verify({
    secret: process.env.OTP_SECRET,
    encoding: "base32",
    token: otp,
    window: 1,
    step: 300,
  });

  if (!isValid) return res.status(400).json({ error: "Invalid OTP" });

  const user = await UserModel.findById(decoded.userId);
  if (!user) return res.status(400).json({ error: "User not found" });

  return generateTokenAndRespond(res, user);
}

async function generateTokenAndRespond(res, user) {
  user.lastLogin = new Date();
  await user.save();

  const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: "1d",
  });

  const returnUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role.name,
  };

  res.cookie("authToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res
    .status(200)
    .json({ success: "Logged in successfully", user: returnUser, token });
}

async function forgotPassword(req, res) {
  const { error } = validateForms.validateEmail(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  // Checking if the user exists
  const user = await UserModel.findOne({ email: req.body.email }).populate(
    "role"
  );
  if (!user) return res.status(400).json({ error: "Email is not found" });

  try {
    let payload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role.name,
    };

    // generate a token with 600 seconds of expiration
    const resetToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: 600,
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: "Password Reset Request",
      html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #000;">Password Reset Request</h2>
                <p>Hello ${user.name},</p>
                <p>We received a request to reset your password. Click the link below to choose a new password:</p>
                <p>
                    <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}" 
                    style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #DF2020; text-decoration: none; border-radius: 5px;">
                    Reset Your Password
                    </a>
                </p>
                <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
                <p>Thanks,</p>
                <p>The Support Team</p>
                </div>
            `,
    };
    await sendEmail(mailOptions);

    res.json({ success: "Check your email to reset your password!!" });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "Something went wrong" });
  }
}

async function resetPassword(req, res) {
  const { token } = req.params;
  if (!token) return res.status(401).json({ error: "Access denied" });

  const { error } = validateForms.validatePassword(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    // verify token
    const decoded_user = validateToken(token);
    if (!decoded_user.success) {
      return res
        .status(401)
        .json({ error: "Invalid or expired password reset token" });
    }

    console.log("user decode", decoded_user);

    const _id = decoded_user.data._id;

    // Generate a salt
    const salt = await bcryptjs.genSalt(10);

    const hashedPassword = await bcryptjs.hash(req.body.password, salt);

    // Update the user's password and clear the reset token fields
    const updatedUser = await UserModel.updateOne(
      { _id: _id },
      { password: hashedPassword }
    );

    res.status(200).json({ success: "Password reset successfully" });
  } catch (e) {
    console.log(e);
    return res.status(400).json({ error: "Something went wrong" });
  }
}

function logout(req, res) {
  req.user = null;
  req.cookies["authToken"] = null;
  res.cookie("authToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.json({ success: "Logged out successfully" });
}

function me(req, res) {
  console.log(req.user);
  res.json({ user: req.user });
}

module.exports = {
  register,
  login,
  activate,
  sendOtp,
  verifyOtp,
  logout,
  forgotPassword,
  resetPassword,
  me,
};
