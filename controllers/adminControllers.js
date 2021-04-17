const { promisify } = require("util");
const Admin = require("../models/Admin");
const Employee = require("../models/Employee");
const Site = require("../models/Site");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const checkAndFormatDate = time => {
  return time ? moment(new Date(time)).format("lll") : "-";
};

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
exports.addSite = async (req, res) => {
  try {
    const site = await Site.create(req.body);
    res.json({ success: true, data: site });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
exports.deleteSite = async (req, res) => {
  try {
    const site = await Site.findByIdAndDelete(req.params.siteId);
    res.json({ success: true, data: "site deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.employeeId);
    res.json({ success: true, data: "employee deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
/// views
exports.viewAdminPage = async (req, res) => {
  try {
    let employees = await Employee.find();
    employees = employees.map(employee => ({
      ...employee.toObject(),
      clockInTime: checkAndFormatDate(employee.clockInTime),
      clockOutTime: checkAndFormatDate(employee.clockOutTime),
      breakStartTime: checkAndFormatDate(employee.breakStartTime),
      breakEndTime: checkAndFormatDate(employee.breakEndTime),
      location: Object.values(employee.location.toObject()).join(", "),
    }));
    return res.render("admin/admin", { employees });
  } catch (error) {
    console.log(error);
    res.redirect("/admin");
  }
};
exports.viewProfilePage = (req, res) => {
  res.render("admin/profile", { admin: req.admin });
};
exports.viewAllSitePage = async (req, res) => {
  try {
    const allSites = await Site.find();

    res.render("admin/allSite", { sites: allSites });
  } catch (error) {
    console.log(error);
    res.redirect("/admin");
  }
};
exports.viewAddSitePage = (req, res) => {
  res.render("admin/addSite", { admin: req.admin });
};
