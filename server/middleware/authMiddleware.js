const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/constants");

const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ success: false, message: "Access denied: No token provided" });

  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

const requireAdmin = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }
    next();
  });
};

module.exports = auth;
module.exports.requireAdmin = requireAdmin;
