const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post(
	"/send-email",
	upload.fields([
		{ name: "file", maxCount: 1 },
		{ name: "attachment", maxCount: 1 },
	]),
	emailController.sendEmails
);
router.get("/trace/mail/:uuid", emailController.trackEmail);
router.get("/email-stats", emailController.getEmailStats);
router.get("/clear", emailController.clearEmails);
router.get("/clear-mail/:uuid", emailController.deleteEmail);

module.exports = router;
