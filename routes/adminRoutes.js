const router = require("express").Router();
const adminControllers = require("../controllers/adminControllers");
router.route("/api/create-admin").post(adminControllers.createAdmin);
router.route("/api/login").post(adminControllers.login);
router.use(adminControllers.isAdmin);
router.route("/").get(adminControllers.viewAdminPage);
router.get("/logout", adminControllers.logOut);
router.get("/profile", adminControllers.viewProfilePage);
//apis
router.route("/api/update-credentials").post(adminControllers.updateAdmin);
module.exports = router;
