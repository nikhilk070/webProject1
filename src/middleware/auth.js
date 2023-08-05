//---------------------(7)authentication-------------------------
require("dotenv").config();
const SignupUser = require("../models/signup");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(token, "mynameisnikhilfromjecrccollege");
    console.log(verifyUser);

    const user = await SignupUser.findOne({ _id: verifyUser._id });
    console.log(user.firstname);

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).redirect("/error");
  }
};

module.exports = auth;
