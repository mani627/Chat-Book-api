
const express = require("express");

const router = express.Router();
const db = require('../Connection/Connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisify } = require("util");
const { log } = require("console");
const path = require('path');
const auth = require('../auth/auth')

router.post('/Login_User', async (req, res) => {

  // user1- manii@gmail.com,Mani@1234
  // user2 - ram@gmail.com,Mani@1234
  // user3 - selva@gmail.com,Mani@1234


  try {

    bcrypt.hash( req.body.password, 5, function(err, hash) {
      console.log(hash)
  });
    // Login
    let database = await db.Get_Database();
    const collection = database.collection('User_Details');
    const cursor = await collection.find({ email: req.body.email }).toArray();
    if (cursor.length === 0) {
      res.json({
        mssg: "User Invalid"
      })
    } else {

      if (!(await bcrypt.compare(req.body.password, cursor[0]["password"]))) {
        res.json({
          mssg: "Incorrect Password"
        })
      }
      else {

        const token = jwt.sign({ id: req.body.email }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN
        })

        res.json({
          mssg: "Successfully Logged",
          payload: [cursor, token]
        })
      }

    }

  } catch (error) {
    res.json({
      error: {
        status: error.status || 500,
        message: error.message || "Internal Server Error",
      },
    });
  }

})






//insert book
router.post('/Insert_book', auth, async (req, res) => {

  //  console.log(req.get('host'),req.protocol);
  console.log( req.files);
  let decoded_user = req.token_decoded.id;
  let img_path = ''

  try {

    let files=Array.isArray( req.files.image_file)?req.files.image_file:[req.files.image_file]

    files.forEach(e => {
      let modify_name = `${new Date().getTime()}_${e.name}`;
      let absolute_path = path.join(__dirname, '../', 'Images', '/')
      //only for file move
      e.mv(`${absolute_path}${modify_name}`);
      // img_path += `${absolute_path}${modify_name},`
      img_path += `${req.protocol}://${req.get('host')}/Images/${modify_name},`


    })

    let database = await db.Get_Database();
    const collection = database.collection('Book_Details');
    let already_Exist = await collection.findOne({ Book_Name: req.body.Book_Name });

    // Already Exist 
    if (already_Exist) {
      res.json({
        mssg: "Already Exist",

      })
    }
    // Insert new One 
    else {
      const cursor = await collection.insertOne({ Book_Name: req.body.Book_Name, Book_Desc: req.body.Book_Desc, Image: img_path, CreatedBy: decoded_user });

      res.json({
        mssg: cursor,

      })
    }

  } catch (error) {
    res.json({
      error: {
        status: error.status || 500,
        message: error.message || "Internal Server Error",
      },
    });
  }

})



// get all book

router.get('/get_book', auth, async (req, res) => {
  console.log(req.query);

  try {

    let database = await db.Get_Database();
    const collection = database.collection('Book_Details');
    let cursor = await collection.find({}).sort({ _id: -1 }).skip(+req.query.skip).limit(+req.query.limit).toArray();

    res.json({
      mssg: cursor,

    })


  } catch (error) {
    res.json({
      error: {
        status: error.status || 500,
        message: error.message || "Internal Server Error",
      },
    });
  }

})



//get user's fav
router.post('/get_book_fav', auth, async (req, res) => {
  let decoded_user = req.token_decoded.id;

  try {



    let database = await db.Get_Database();
    const collection = database.collection('User_Details');
    let cursor = await collection.find({ "email": decoded_user }).project({ "fav": 1 }).toArray();
    console.log({ cursor });
    res.json({
      mssg: cursor,

    })


  } catch (error) {
    res.json({
      error: {
        status: error.status || 500,
        message: error.message || "Internal Server Error",
      },
    });
  }

})

//  Add fav
router.post('/Add_Fav', auth, async (req, res) => {
  let decoded_user = req.token_decoded.id;

  try {

    let database = await db.Get_Database();
    const collection = database.collection('User_Details');
    let cursor = await collection.updateOne({ "email": decoded_user }, { $push: { "fav": req.body.add } })

    res.json({
      mssg: cursor,

    })


  } catch (error) {
    res.json({
      error: {
        status: error.status || 500,
        message: error.message || "Internal Server Error",
      },
    });
  }

})


//  Remove fav
router.post('/Remove_Fav', auth, async (req, res) => {
  let decoded_user = req.token_decoded.id;

  try {

    let database = await db.Get_Database();
    const collection = database.collection('User_Details');
    let cursor = await collection.updateOne({ "email": decoded_user }, { $pull: { "fav": req.body.remove } })

    res.json({
      mssg: cursor,

    })


  } catch (error) {
    res.json({
      error: {
        status: error.status || 500,
        message: error.message || "Internal Server Error",
      },
    });
  }

})




//  Get Overall book count
router.get('/Get_Book_Count', auth, async (req, res) => {
  let decoded_user = req.token_decoded.id;

  try {

    let database = await db.Get_Database();
    const collection = database.collection('Book_Details');
    let cursor = await collection.countDocuments()

    res.json({
      mssg: cursor,

    })


  } catch (error) {
    res.json({
      error: {
        status: error.status || 500,
        message: error.message || "Internal Server Error",
      },
    });
  }

})


















module.exports = router;
