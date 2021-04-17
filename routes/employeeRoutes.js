const express = require("express");
const router = express.Router();
const employeeControllers = require("../controllers/employeeControllers");
router.route("/").get(employeeControllers.viewIndexPage);

/// apis
router.post("/api/employee/create", employeeControllers.create);
router.patch("/api/employee/update/:employeeId", employeeControllers.update);
module.exports = router;
