const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function adminMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }
    const isAdmin = user.role && String(user.role).toLowerCase() === "admin";
    if (!isAdmin) {
      return res.status(403).json({ error: "Access denied. Admin role required." });
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = { adminMiddleware };