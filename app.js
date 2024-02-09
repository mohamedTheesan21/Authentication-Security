const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dbConnct = require('./dbConnect');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

dbConnct();




app.listen(3000, () => {
  console.log('Server is running on port 3000');
});