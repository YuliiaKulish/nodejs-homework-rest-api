const express = require("express");
const multer = require("multer");
const userMiddleware = require("../middlewares/user");

const { verifySchema } = require("../middlewares/validation");
const {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  updateSubscription,
  updateAvatar,
  verifyUser,
  reSendMail,
} = require("./controllers");

const router = express.Router();
const upload = multer({ dest: "tmp/" });

router.get("/login", loginUser);
router.post("/signup", registerUser);
router.post("/logout", userMiddleware, logoutUser);

router.get("/current", userMiddleware, getCurrentUser);
router.patch("/", userMiddleware, updateSubscription);
router.patch("/avatars", upload.single("avatar"), updateAvatar);
router.get("/verify/:verificationToken", verifyUser);
router.post("/verify", verifySchema, reSendMail);

module.exports = router;
