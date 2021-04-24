const moment = require("moment");
module.exports = time => {
  return time
    ? moment.tz(time, "America/Los_Angeles").format("MM-DD-YYYY HH:mm A")
    : "-";
};
