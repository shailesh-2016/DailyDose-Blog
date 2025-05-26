const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

exports.verifyToken = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token", error: error.message });
    }
  } else {
    res.status(401).json({ message: "No token, not authorized" });
  }
};
