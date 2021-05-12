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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
