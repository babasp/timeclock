const Employee = require("../models/Employee");
const Site = require("../models/Site");
exports.viewIndexPage = (req, res) => {
  res.render("index");
};

// api controllers
exports.update = async (req, res) => {
  const { siteName, siteLink, pin, name } = req.body;
  try {
    const hasSite = await Site.findOne({ siteName, siteLink });
    if (!hasSite) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials!" });
    }
    const employee = await Employee.findOneAndUpdate({ pin, name }, req.body, {
      new: true,
    });
    if (!employee) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials!" });
    }
    res.json({ success: true, data: employee });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message });
  }
};
// exports.update = async (req, res) => {
//   try {
//     if (req.body.clockInTime) {
//       req.body.clockOutTime = undefined;
//       req.body.breakStartTime = undefined;
//       req.body.breakEndTime = undefined;
//     }
//     const employee = await Employee.findByIdAndUpdate(
//       req.params.employeeId,
//       req.body,
//       { new: true }
//     );
//     res.json({ success: true, data: employee });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// };
