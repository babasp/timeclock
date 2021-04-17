const Employee = require("../models/Employee");
exports.viewIndexPage = (req, res) => {
  res.render("index");
};

// api controllers
exports.create = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
exports.update = async (req, res) => {
  try {
    if (req.body.clockInTime) {
      req.body.clockOutTime = undefined;
      req.body.breakStartTime = undefined;
      req.body.breakEndTime = undefined;
    }
    const employee = await Employee.findByIdAndUpdate(
      req.params.employeeId,
      req.body,
      { new: true }
    );
    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
