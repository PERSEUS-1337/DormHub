if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({path: __dirname+'/.env'});
}

const express = require("express");
// const cors = require("cors");

const app = express();
app.use(express.json());

require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
// app.use(cors());
// app.use(require("./routes/record"));
// // get driver connection
// const dbo = require("./db/conn");
 
app.listen(port, () => {
  // perform a database connection when server starts
  // dbo.connectToServer(function (err) {
  //   if (err) console.error(err);
 
  // });
  console.log(`Server is running on port: ${port}`);
});