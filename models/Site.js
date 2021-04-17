const mongoose = require("mongoose");
const siteSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      required: true,
    },
    siteLink: {
      type: String,
      required: true,
    },
    pin: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Site", siteSchema);
