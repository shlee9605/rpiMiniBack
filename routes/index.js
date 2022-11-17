const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');       //for login

const bcrypt = require('bcrypt');           //for hash

const {isLoggedIn, isNotLoggedIn} = require('./middlewares');   //login middleware

const User=require('../models/user');       //get User SQL Table
const e = require('express');

const router = express.Router();            //use router


// Local Login api
router.post('/login', async (req, res) => {
    const { userid, password } = req.body;
    console.log(userid, password);
    // id = id.toLowerCase();
    const validId = await User.findOne({ where: { userid } });
    try {
      // id validation check
      if (!validId) {
        return res.sendStatus(404);
      }
      // password validation check
      const validPassword = await bcrypt.compare(password, validId.password)
      if (validPassword) {
        const token = jwt.sign({
          id: userid,
        }, process.env.JWT_SECRET, {
          expiresIn: '30000m',  
          issuer: 'rpiProject',
        });
        res.cookie('token', token, {
          httpOnly: true
        })
        console.log(token);
        return res.status(200).json({
          message: '토큰이 발급되었습니다',
          token,
        });
      } else {
        return res.sendStatus(400);
      }
    } catch (error) {
      return res.sendStatus(404);
    }
  })


router.get('/logout', isLoggedIn, (req, res)=>{ //user logout
    req.logout()
    req.session.destroy();          //distroy cookie session
    res.redirect('/');
});

module.exports = router;