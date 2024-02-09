require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const encrypt = require('mongoose-encryption');
const dbConnct = require('./dbConnect');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

// dbConnct();
mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

/////////////////////////////////// Encryption ////////////////////////////////////////
const secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret , encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/:page", (req, res) => {
    if(req.params.page === "register"){
        res.render("register");
    }else if(req.params.page === "login"){
        res.render("login");
    }
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.email,
        password: req.body.password
    });

    if(req.body.password === req.body.confirmPassword){
        User.findOne({email: req.body.email}).then(async (user) => {
            if(user){
                res.render("register", {message: "User already exist"});
            }else{
                await newUser.save().then(() => {
                    res.render("secrets");
                });
            }
        });
        
    }else{
        res.render("register" , {message: "Password and Confirm Password are not same"});

    }

})

app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email}).then((user) => {
        if(user){
            if(user.password === password){
                res.render("secrets");
            }else{
                res.render("login", {message: "Password is incorrect"});
            }
        }else{
            res.render("login", {message: "User not found"});
        }
    })
})




app.listen(3000, () => {
  console.log('Server is running on port 3000');
});