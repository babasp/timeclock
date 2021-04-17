const mongoose = require("mongoose");
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

module.exports = mongoose.model("Employee", employeeSchema);
