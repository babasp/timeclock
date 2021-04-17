const moment = require("moment");
module.exports = time => {
  return time ? moment(new Date(time)).format("lll") : "-";
};
