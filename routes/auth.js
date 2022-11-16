const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
// const {isLoggedIn, isNotLoggedIn} = require('./middlewares');   //logged in middleware
const User = require('../models/user');

const router = express.Router();

router.post('/signUp', async (req, res) => {
    const { userid, password } = req.body;
    // console.log(req.body);
    try {
      console.log(req.body);  
      const hash = await bcrypt.hash(password, 12);  // password encryption
      await User.create({
        userid,
        password: hash,
      });
      return res.sendStatus(201);
    } catch (error) {

      return res.sendStatus(400);
    }
  })


// router.post('/join', isNotLoggedIn, async(req, res, next)=>{
//     const {userid, password} = req.body;                        //get front form data
//     try{
//         const exUser = await User.findOne({where: { userid }}); //verify same id
//         if(exUser){
//             return res.status(400).json({
//               message: "already existed"  
//             })
//         }
//         const hash = await bcrypt.hash(password, 12);           //else get hashed password
//         await User.create({                                     //and create into DB
//             userid,
//             password: hash,
//         });
//         return res.sendStatus(201);
//     } catch(error){                                             //if inverified form data, 
//         console.error(error);
//         return next(error);
//     }
// });

module.exports = router;