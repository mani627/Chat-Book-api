var express = require('express');  
var app = express(); 
const bodyparser = require("body-parser");
const dotenv = require('dotenv');




//database constant config .env
dotenv.config({
    path: "./.env"
})

// CONNECTION CHECK
const con = require('./Connection/Connection');
con.connect((err) => {
    if (err) {
      console.log("Database Connection Failed !!!", err);
    } else {
      console.log("connected to Database");
    }
});



app.get('/', function (req, res) {  
  res.send('Welcome to JavaTpoint!');  
}); 





var server = app.listen(8080, function () {  
  
  console.log('connected')
});  