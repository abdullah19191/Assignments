const express = require("express");
const router = express.Router();
const { createBlogPost } = require("../controllers/addblogController");
const authenticateUser = require("../middleware/auth");

// Authenticate users for all routes in this file
router.use(authenticateUser);

// Route to create a new blog post
router.post("/addposts", createBlogPost);

module.exports = router;
