const express = require("express");
const router = express.Router();
const employeeControllers = require("../controllers/employeeControllers");
router.route("/").get(employeeControllers.viewIndexPage);
module.exports = router;
