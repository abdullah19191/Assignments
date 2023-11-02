const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const blogsRoutes = require("./routes/blogs");
const commentsRoutes = require("./routes/comments");
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/blog", blogsRoutes);
app.use("/api/blog", commentsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
