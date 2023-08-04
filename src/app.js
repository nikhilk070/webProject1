const express = require("express");
const { expr } = require("jquery");
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

require("./db/conn");
const Register = require("./models/register");
const SignupUser = require("./models/signup");
const auth = require("./middleware/auth");

const port = process.env.PORT || 8001;
const app = express();

//------------------------------------------------------setting the path-------------------------------
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

// --------------------------------------------------------middleware------------------------------------
app.use(express.json()); //when we use json in express
app.use(cookieParser());
app.use(express.static(static_path));
app.use(express.urlencoded({ extended: false })); // when json is used in browser through hbs
app.use(
  "/css",
  express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js"))
);
app.use(
  "/jq",
  express.static(path.join(__dirname, "../node_modules/jquery/dist"))
);

app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

// ------------------------------------------------routing---------------------------------------
app.get("/home", auth, (req, res) => {
  res.render("index");
});
app.get("/", (req, res) => {
  res.render("signup");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/error", (req, res) => {
  res.render("error");
});
//-----------------------------------------------(8)logout---------------------------------
app.get("/logout", auth, async (req, res) => {
  try {
    console.log(req.user);
    // FOR SINGLE LOGOUT
    // req.user.tokens = req.user.tokens.filter((currElement) => {
    //   return currElement.token !== req.token;
    // });

    // FOR LOGOUT FROM ALL DEVICES
    req.user.tokens = [];

    res.clearCookie("jwt");

    console.log("logout successfully");
    await req.user.save();
    res.redirect("/login");
  } catch (e) {
    res.status(500).send("logout:" + e);
  }
});
//-----------------------------------------------post method for contact form-------------------------
app.post("/contact", async (req, res) => {
  try {
    const registerUser = new Register(req.body);
    await registerUser.save();
    res.status(201).render("index");
  } catch (e) {
    res.status(400).send(e);
    console.log("the error part page" + e);
  }
});

//-----------------------------------------------post method for signup form---------------------------
app.post("/signup", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;
    if (password === cpassword) {
      const signupregister = new SignupUser({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: password,
        confirmpassword: cpassword,
      });

      //-----------------(2)Token part-----------------------
      console.log("the success part" + signupregister);

      const token = await signupregister.generateAuthToken();
      console.log("the token part " + token);

      //-----------------(5)store JWT token in cookie-------------------
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 600000),
        httpOnly: true,
      });
      // console.log(cookie);

      const signupRegistered = await signupregister.save();

      res.status(201).redirect("/home");
    } else {
      res.send("password are not matching");
    }
  } catch (e) {
    res.status(400).send(e);
    console.log("the error is at signup:" + e);
  }
});
//------------------------------------------------------------login check--------------------------------------
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const username = await SignupUser.findOne({ email: email });
    const isMatch = await bcrypt.compare(password, username.password);
    //(4)token in login
    const token = await username.generateAuthToken();
    console.log("the token part " + token);
    //(6)cookie in login
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 600000),
      httpOnly: true,
    });

    if (isMatch) {
      res.status(201).redirect("/home");
    } else {
      res.send("invalid details");
    }
  } catch (e) {
    res.status(400).send("invalid email");
  }
});
// ---------------------------------------------------------server create-----------------------------------
app.listen(port, () => {
  console.log(`server is running at ${port}`);
});
