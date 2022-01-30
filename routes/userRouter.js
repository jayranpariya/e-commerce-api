const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getSingleUsers,
  updateUser,
  updateUserPassword,
  showCurrentUser,
} = require("../controllers/userController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin"), getAllUsers);

router.route("/showMe").get(authenticateUser, showCurrentUser);
router.route("/updateUser").patch(authenticateUser, updateUser);
router
  .route("/updateUsersPassword")
  .patch(authenticateUser, updateUserPassword);

router.route("/:id").get(authenticateUser, getSingleUsers);

module.exports = router;
