

const express = require("express");

const router = express.Router();
const db = require('../Connection/Connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisify } = require("util");
const { log } = require("console");
const path = require('path');




 const auth=async(req,res,next)=>{

    const header=req.headers.authorization;
    const token=header&&header.split(' ')[1]
    if(!token){
      res.sendStatus(401)
    }else{
  
      try {
        let decode = await promisify(jwt.verify)(
          token, process.env.JWT_SECRET
        )
    
        req.token_decoded=decode
        next();
      } catch (error) {
        res.json({
          error: {
            status: error.status || 500,
            message: error.message || "Internal Server Error",
          },
        });
      }
    }
    
  }

  module.exports = auth;