// const jwt = require("jsonwebtoken");
const { pool } = require("../dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "370 days" });
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new Error("All fields must be filled");
    }

    const query = {
      text: "SELECT * FROM users WHERE email = $1",
      values: [email],
    };

    const result = await pool.query(query);
    const user = result.rows[0];

    if (!user) {
      throw new Error("Incorrect Email");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Incorrect Password");
    }

    const token = createToken(user.id);
    const message = "Successfully logged in";

    res.status(200).json({ message, email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup user
const signupUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      throw new Error("All fields must be filled");
    }
    // checking if email already exist or not
    const checkEmailQuery = {
      text: "SELECT * FROM users WHERE email = $1",
      values: [email],
    };

    const emailCheckResult = await pool.query(checkEmailQuery);
    const existingUser = emailCheckResult.rows[0];

    if (existingUser) {
      throw new Error("Email already exists");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertQuery = {
      text: "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id",
      values: [name, email, hashedPassword],
    };

    const insertResult = await pool.query(insertQuery);
    const newUser = insertResult.rows[0];

    const token = createToken(newUser.id);

    const message = "Successfully signed up";

    res.status(200).json({ message, email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { loginUser, signupUser };
