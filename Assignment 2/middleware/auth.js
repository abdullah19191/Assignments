const jwt = require("jsonwebtoken");
const { pool } = require("../dbConfig");

const authenticateUser = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET);

    const user = await getUserFromDatabase(decoded._id);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

const getUserFromDatabase = async (userId) => {
  const query = {
    text: "SELECT * FROM users WHERE id = $1",
    values: [userId],
  };
  const result = await pool.query(query);
  return result.rows[0];
};

module.exports = authenticateUser;
