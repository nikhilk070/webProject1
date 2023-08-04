const mongoose = require("mongoose");
const validator = require("validator");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email ID");
      }
    },
  },
  phone: {
    type: Number,
    required: true,
    min: 10,
  },
  message: {
    type: String,
    required: true,
    minLength: 3,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// collection
const Register = new mongoose.model("Register", contactSchema);

module.exports = Register;
