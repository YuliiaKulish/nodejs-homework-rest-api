const UserSchema = require("./schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const Jimp = require("jimp");
const gravatar = require("gravatar");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const avatarURL = gravatar.url(email);
  const verificationToken = uuidv4;
  const user = await UserSchema.findOneAndUpdate(
    { email },
    {
      name,
      email,
      password: await bcrypt.hash(password, 10),
      avatarURL,
      verificationToken,
    },
    { upsert: true }
  );
  const config = {
    host: "smtp.meta.ua",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  };

  const transporter = nodemailer.createTransport(config);
  const port = process.env.PORT;
  const host = process.env.HOST;
  const emailOptions = {
    from: process.env.MAIL,
    to: email,
    subject: "Please, confirm you email",
    html: `<a href="https://${host}${port}/api/users/verify/${verificationToken}">Confirm</>`,
  };

  await transporter.sendMail(emailOptions);
  if (user) {
    res.status(409).json({ message: "Email in use" });
    return;
  }
  res.status(201).json({ message: "User successfully registered" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserSchema.findOne({ email });
  if (!user) {
    res.status(400).json({ message: "Email or password is wrong" });
    return;
  }
  const validPassword = bcrypt.compare(password, user.password);
  if (!validPassword) {
    res.status(401).json({ message: "Email or password is wrong" });
    return;
  }
  const token = jwt.sign({ id: user._id }, process.env.SECRET_TOKEN);
  const data = await UserSchema.findOneAndUpdate(
    { email },
    { $set: { token } },
    { new: true }
  );
  res.status(200).json({
    token: data.token,
    email,
    subscription: data.subscription,
    id: user._id,
  });
};

const getCurrentUser = async (req, res) => {
  return res.status(200).json(req.user);
};

const logoutUser = async (req, res) => {
  const { _id } = req.user;
  await UserSchema.findByIdAndUpdate(
    _id,
    { $set: { token: null } },
    { new: true }
  );
  res.status(204).end();
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  await UserSchema.findByIdAndUpdate(_id, {
    $set: { subscription },
  });
  res.status(200).json({ subscription }).end();
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path } = req.file;
  const result = await Jimp.read(path);
  result.cover(250, 250).write(`public/avatars/${_id}`);
  await fs.unlink(path);
  await UserSchema.findByIdAndUpdate(_id, { avatarURL: `/avatars/${_id}` });
  res.status(200).json({ avatarURL: `/avatars/${_id}` });
};

const verifyUser = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await UserSchema.findOneAndUpdate(
    { verificationToken },
    {
      verificationToken: null,
      verify: true,
    },
    { new: true }
  );
  if (!user) {
    res.status(404).json({
      status: "error",
      message: "User not found",
    });
    return;
  }
  res.status(200).json({ message: "Verification successful" });
};

const reSendMail = async (req, res) => {
  const { email } = req.body;
  const user = UserSchema.findOne({ email });
  if (user.verify) {
    return res
      .status(400)
      .json({ message: "Verification has already been passed" });
  }
  const config = {
    host: "smtp.meta.ua",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  };

  const transporter = nodemailer.createTransport(config);
  const port = process.env.PORT;
  const host = process.env.HOST;
  const verificationToken = user.verificationToken;
  const emailOptions = {
    from: process.env.MAIL,
    to: email,
    subject: "Please, confirm you email",
    html: `<a href="https://${host}${port}/api/users/verify/${verificationToken}">Confirm</>`,
  };

  await transporter.sendMail(emailOptions);
  res.status(200).json({
    message: "Verification email sent....again",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  updateSubscription,
  updateAvatar,
  verifyUser,
  reSendMail,
};
