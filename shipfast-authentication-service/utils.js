const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateAuthToken = () => {
  const token = jwt.sign(
    {
      id: this.id,
      name: this.name,
      email: this.email,
    },
    process.env.JWT_PRIVATE_KEY
  );
  return token;
};

exports.generateAuthToken = generateAuthToken;
