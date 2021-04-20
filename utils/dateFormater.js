const moment = require("moment");
module.exports = time => {
  return time ? moment(time).format("MM-DD-YYYY HH:mm A") : "-";
};
