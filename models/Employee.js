const mongoose = require("mongoose");
const checkAndFormatDate = require("../utils/dateFormater");
const moment = require("moment");
const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    pin: {
      type: String,
      required: [true, "pin is required"],
    },
    siteName: {
      type: String,
    },
    siteLink: {
      type: String,
    },
    location: {
      lat: Number,
      lng: Number,
    },
    clockInTime: {
      type: Date,
    },
    clockOutTime: {
      type: Date,
    },
    breakStartTime: {
      type: Date,
    },
    breakEndTime: {
      type: Date,
    },
  },
  { timestamps: true }
);
const calculateTotalTime = (shiftStart, shiftEnd) => {
  if (shiftStart && shiftEnd) {
    shiftEnd = moment(shiftEnd);
    const h = shiftEnd.diff(shiftStart, "hours");
    var mins = moment
      .utc(moment(shiftEnd, "HH:mm:ss").diff(moment(shiftStart, "HH:mm:ss")))
      .format("mm");
    console.log(h);
    // console.log(duration);
    return `${h} hour and ${mins} minutes`;
  } else {
    return "-";
  }
};
employeeSchema.statics.formateDateAndTime = function (employees) {
  return employees.map(employee => ({
    ...employee.toObject(),
    clockInTime: checkAndFormatDate(employee.clockInTime),
    clockOutTime: checkAndFormatDate(employee.clockOutTime),
    breakStartTime: checkAndFormatDate(employee.breakStartTime),
    breakEndTime: checkAndFormatDate(employee.breakEndTime),
    location: Object.values(employee.location.toObject()).join(", "),
    totalTime: calculateTotalTime(employee.clockInTime, employee.clockOutTime),
  }));
};
module.exports = mongoose.model("Employee", employeeSchema);
