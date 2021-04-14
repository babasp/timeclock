const router = require("express").Router();
const adminControllers = require("../controllers/adminControllers");
router
  .route("/")
  .get(adminControllers.isLoggedIn, adminControllers.viewAdminPage);
module.exports = router;
