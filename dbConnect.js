const mongoose = require("mongoose");

const DB_URL = "mongodb+srv://myAtlasDBUser:12345@myatlasclusteredu.zdyf7zp.mongodb.net/wikiDB";

async function dbConnect() {
  await mongoose
    .connect(
        DB_URL
    )
    .then(() => {
      console.log("Successfully connected to MongoDB Atlas!");
    })
    .catch((error) => {
      console.log("Unable to connect to MongoDB Atlas!");
      console.error(error);
    });
}

module.exports = dbConnect;