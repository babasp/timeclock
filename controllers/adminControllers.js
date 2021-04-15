const { promisify } = require("util");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const signToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
const createAndSendToken = (admin, statusCode, req, res) => {
  const token = signToken(admin._id);
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 20 * 60 * 60 * 1000
    ),
    httpOnly: true,
  });
  admin.password = undefined;
  res.status(statusCode).json({
    success: true,
    token,
    data: {
      admin,
    },
  });
};
exports.createAdmin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "email and password is requird" });
  }
  try {
    const admin = await Admin.create(req.body);
    res.json({ data: admin, success: true });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "email and password is required" });
  }
  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin || !(await admin.correctPass(password, admin.password))) {
    return res
      .status(401)
      .json({ success: false, message: "invalid email or password!" });
  }
  createAndSendToken(admin, 200, req, res);
};

exports.logOut = (req, res) => {
  res.cookie("jwt", "null", { expires: new Date(Date.now() + 10) });
  res.redirect("/admin");
};

exports.isAdmin = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decode.id);
    if (!admin) {
      return res.render("login");
    }
    req.admin = admin;
    next();
  } else {
    res.render("login");
  }
};
exports.updateAdmin = async (req, res) => {
  const { currentPass, newPass, email } = req.body;
  try {
    const admin = await Admin.findById(req.admin._id).select("+password");
    if (!admin || !(await admin.correctPass(currentPass, admin.password))) {
      return res
        .status(400)
        .json({ success: false, message: "current password is incorrect" });
    }
    admin.email = email;
    admin.password = newPass;
    await admin.save();
    res.json({ success: true, data: admin });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
/// views
exports.viewAdminPage = (req, res) => {
  return res.render("admin");
};
exports.viewProfilePage = (req, res) => {
  res.render("profile", { admin: req.admin });
};
