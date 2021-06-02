const Employee = require("../models/Employee");
const Work = require("../models/Work");
const momentTz = require("moment-timezone");
const Site = require("../models/Site");
exports.viewIndexPage = (req, res) => {
  res.render("index");
};

// api controllers
exports.update = async (req, res) => {
  const { siteName, pin, name, id } = req.body;
  try {
    const hasSite = await Site.findOne({ siteName });
    const hasEmployee = await Employee.findOne({ name, pin });
    if (!hasSite || !hasEmployee) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials!" });
    }
    req.body.employeeName = hasEmployee.name;
    req.body.employeePin = hasEmployee.pin;
    req.body.site = hasSite.siteName;
    if (req.body.clockInTime) {
      req.body.inLocation = req.body.location;
    } else if (req.body.clockOutTime) {
      req.body.outLocation = req.body.location;
    }

    let work;
    if (req.body.clockInTime) {
      work = await Work.create(req.body);
    } else if (id) {
      work = await Work.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
      });
    } else {
      const currentWorker = await Work.findOne({ employeeName: name }).sort({
        createdAt: -1,
      });
      work = await Work.findByIdAndUpdate(currentWorker._id, req.body, {
        new: true,
      });
    }

    work = work.employeeDateAndtime(work);

    res.json({
      success: true,
      data: work,
    });
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
