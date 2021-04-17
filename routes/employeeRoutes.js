const express = require("express");
const router = express.Router();
const employeeControllers = require("../controllers/employeeControllers");
router.route("/").get(employeeControllers.viewIndexPage);

/// apis
router.patch("/api/employee/update", employeeControllers.update);
// router.patch("/api/employee/update/:employeeId", employeeControllers.update);
module.exports = router;
