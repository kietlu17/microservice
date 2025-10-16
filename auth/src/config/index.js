require("dotenv").config();

module.exports = {
  mongoURI: process.env.MONGODB_AUTH_URI || "mongdb://localhost:27127/auth",
  jwtSecret: process.env.JWT_SECRET || "secret",
};
