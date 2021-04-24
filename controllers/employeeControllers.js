const Employee = require("../models/Employee");
const momentTz = require("moment-timezone");
const checkAndFormatDate = require("../utils/dateFormater");
const Site = require("../models/Site");
exports.viewIndexPage = (req, res) => {
  res.render("index");
};

// api controllers
exports.update = async (req, res) => {
  const { siteName, pin, name } = req.body;
  try {
    const hasSite = await Site.findOne({ siteName });
    if (!hasSite) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials!" });
    }
    delete req.body.pin;
    if (req.body.clockInTime) {
      req.body.inLocation = req.body.location;
    } else if (req.body.clockOutTime) {
      req.body.outLocation = req.body.location;
    }
    let employee = await Employee.findOneAndUpdate({ name }, req.body, {
      new: true,
    });
    if (!employee || pin.toLowerCase() !== employee.pin.toLowerCase()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials!" });
    }
    employee = employee.employeeDateAndtime(employee);

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
