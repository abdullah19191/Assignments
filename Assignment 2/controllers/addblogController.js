const { pool } = require("../dbConfig");

const createBlogPost = async (req, res) => {
  try {
    const { title, description, author } = req.body;

    if (!title || !description || !author) {
      return res.status(400).json({ error: "All fields must be filled" });
    }

    const userId = req.user ? req.user.id : null;
    console.log(userId);

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const query = {
      text: "INSERT INTO blog_posts (title, description, author, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
      values: [title, description, userId],
    };

    const result = await pool.query(query);
    const createdBlogPost = result.rows[0];

    res.status(201).json(createdBlogPost);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the blog post." });
  }
};

module.exports = { createBlogPost };
