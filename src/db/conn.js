require("dotenv").config();

const mongoose = require("mongoose");

//Creating database
mongoose
  .connect(
    "mongodb+srv://ns84993:Nikhil4245@cluster0.njgmpy9.mongodb.net/backendProject1?retryWrites=true&w=majority"
  )

  .then(() => {
    console.log("connection succcessfully with DataBase");
  })
  .catch((e) => {
    console.log("connection failed");
  });
