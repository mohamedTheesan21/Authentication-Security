require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// const encrypt = require('mongoose-encryption');
// const md5 = require('md5');
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
// const dbConnct = require('./dbConnect');

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// dbConnct();
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

/////////////////////////////////// Encryption ////////////////////////////////////////
// const secret = process.env.SECRET;
// userSchema.plugin(encrypt, { secret: secret , encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
// LocalStrategy = require('passport-local').Strategy;
// passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/:page", (req, res) => {
  if (req.params.page === "login") {
    res.render("login");
  } else if (req.params.page === "register") {
    res.render("register");
  } else if (req.params.page === "secrets") {
    if (req.isAuthenticated()) {
      res.render("secrets");
    } else {
      res.redirect("/login");
    }
  }
});

app.post("/register", (req, res) => {
  User.register(
    { email: req.body.email },
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/secrets");
        });
      }
    }
  );
});

app.post("/login", (req, res) => {
    const user = new User({
        email: req.body.email,
        password: req.body.password,
    });
    req.login(user, (err) => {
        if (err) {
        console.log(err);
        res.redirect("/login");
        } else {
        passport.authenticate("local")(req, res, () => {
            res.redirect("/secrets");
        });
        }
    });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
