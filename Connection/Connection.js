var mysql = require('mysql');
const express = require("express");

const router = express.Router();
const mongodb= require('mongodb');
const MongoClient= mongodb.MongoClient;



// Mysql Connection
var con = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE,

});







let  database;

// MongoDB CONNECTION CHECK
async function Get_Database(){
try{
  const client=await MongoClient.connect(process.env.MONGO_CON) 
  database= client.db('Library');

  if(database){
console.log("con");
  }else{
console.log("err");
  }
return database
}catch(err){
console.log("catch",err);
}
    

}


module.exports = {
    Get_Database
  };