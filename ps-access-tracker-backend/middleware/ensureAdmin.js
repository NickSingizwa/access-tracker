/** Use after authMiddleware — verifies req.user is an admin */
function ensureAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const isAdmin = req.user.role && String(req.user.role).toLowerCase() === "admin";
  if (!isAdmin) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

module.exports = { ensureAdmin };
