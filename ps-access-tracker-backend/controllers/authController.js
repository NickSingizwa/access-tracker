const jwt = require("jsonwebtoken");
const User = require("../models/User");

function generateToken(user) {
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

async function signup(req, res) {
  try {
    const { fullName, dateOfBirth, nationality, email, password } = req.body;

    if (!fullName || !dateOfBirth || !nationality || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const user = await User.create({
      fullName,
      dateOfBirth: new Date(dateOfBirth),
      nationality,
      email,
      password,
    });

    const token = generateToken(user);
    const userResponse = {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
    };

    res.status(201).json({ token, user: userResponse });
  } catch (err) {
    console.error("Signup error:", err);
    if (err.code === 11000) {
      return res.status(409).json({ error: "Email already registered" });
    }
    res.status(500).json({
      error: "Registration failed",
      ...(process.env.NODE_ENV !== "production" && { details: err.message }),
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);
    const userResponse = {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
    };

    res.json({ token, user: userResponse });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
}

async function me(req, res) {
  try {
    const user = req.user;
    res.json({
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
}

module.exports = { signup, login, me };
