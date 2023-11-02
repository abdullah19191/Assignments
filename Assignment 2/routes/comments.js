const express = require("express");
const router = express.Router();
const { commentPost } = require("../controllers/commentController");
const authenticateUser = require("../middleware/auth");

router.use(authenticateUser);

router.post("/:blogPostId/comments", commentPost);

module.exports = router;
