const router = require("express").Router();
const adminControllers = require("../controllers/adminControllers");
router.route("/api/create-admin").post(adminControllers.createAdmin);
router.route("/api/login").post(adminControllers.login);
router.use(adminControllers.isAdmin);
router.route("/").get(adminControllers.viewAdminPage);
router.get("/logout", adminControllers.logOut);
router.get("/profile", adminControllers.viewProfilePage);
router.get("/all-site", adminControllers.viewAllSitePage);
router.get("/add-site", adminControllers.viewAddSitePage);
//apis
router.route("/api/update-credentials").post(adminControllers.updateAdmin);
router.route("/api/add-site").post(adminControllers.addSite);
router.route("/api/delete-site/:siteId").delete(adminControllers.deleteSite);
router
  .route("/api/delete-employee/:employeeId")
  .delete(adminControllers.deleteEmployee);
module.exports = router;
