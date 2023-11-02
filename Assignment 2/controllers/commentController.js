const { pool } = require("../dbConfig");

const commentPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Please Enter a comment" });
    }

    const userId = req.user ? req.user.id : null;

    if (!userId) {
      return res.status(401).json({ error: "User is not authenticated" });
    }
    const { blogPostId } = req.params;

    const query = {
      text: "INSERT INTO comments (content, author, blog_post_id, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
      values: [content, userId, blogPostId],
    };

    const result = await pool.query(query);
    const createdComment = result.rows[0];

    res.status(201).json(createdComment);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the comment." });
  }
};

module.exports = { commentPost };
