require("dotenv").config();

const mongoose = require("mongoose");

//Creating database
mongoose
  .connect(process.env.LIVE_DB)

  .then(() => {
    console.log("connection succcessfully with DataBase");
  })
  .catch((e) => {
    console.log("connection failed");
  });
