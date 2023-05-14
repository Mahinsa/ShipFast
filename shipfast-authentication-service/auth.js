const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { saveUser, getUserByEmail } = require("./dynamodb");
const { generateAuthToken } = require("./utils");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    let user = await getUserByEmail(req.body.email);
    if (!_.isEmpty(user))
      return res.status(400).send("User already registered");

    user = _.pick(req.body, ["name", "email", "password"]);
    //generate salt
    const salt = await bcrypt.genSalt();
    //hash password
    user.password = await bcrypt.hash(user.password, salt);
    const savedUser = await saveUser(user);
    //generate token
    const token = generateAuthToken();

    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .status(201)
      .send(_.pick(savedUser, ["id", "name", "email"]));
  } catch (error) {
    res.send(error);
  }
});

router.post("/login", async (req, res) => {
  const user = await getUserByEmail(req.body.email);
  if (_.isEmpty(user))
    return res.status(400).send("Invalid username or password");

  const validatePassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!validatePassword)
    return res.status(400).send("Invalid username or password");

  //generate token
  const token = generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .status(200)
    .send(_.pick(user, ["name", "email"]));
});

module.exports = router;
