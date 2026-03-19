require("dotenv").config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "secretkey",
  JWT_EXPIRY: "1h",
  RATE_PER_HOUR: 50,
  PORT: process.env.PORT || 5000,
};
