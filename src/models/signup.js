require("dotenv").config();
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signupSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email ID");
      }
    },
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});
//--------------------------(3)generating Token---------------------------------
signupSchema.methods.generateAuthToken = async function () {
  try {
    console.log(this._id);
    const token = jwt.sign(
      { _id: this._id.toString() },
      "mynameisnikhilfromjecrccollege"
    );
    this.tokens = this.tokens.concat({ token: token });
    await this.save();

    return token;
  } catch (e) {
    // res.send("the error part" + e);
    console.log("the error part " + e);
  }
};

//--------------------------(1)middleware hashing password----------------------
signupSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // console.log(`the current password is ${this.password}`);
    this.password = await bcrypt.hash(this.password, 10);
    // console.log(`the current password is ${this.password}`);
    // this.confirmpassword = await bcrypt.hash(this.password, 10);
  }

  next();
});

//--------------------------create collection-------------------------

const SignupUser = new mongoose.model("SignupUser", signupSchema);

module.exports = SignupUser;
