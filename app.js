const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dbConnct = require('./dbConnect');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

// dbConnct();

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




app.listen(3000, () => {
  console.log('Server is running on port 3000');
});