const jwt = require("jsonwebtoken");
const config = require("../config");

/**
 * Middleware to verify the token
 */

module.exports = function(req, res, next) {
 const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Extract the token from the header
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the JWT library and the secret key
    const decodedToken = jwt.verify(token, config.jwtSecret);
    req.user = decodedToken;
    console.log(req.user);
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};


