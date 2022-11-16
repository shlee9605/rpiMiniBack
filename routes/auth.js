const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

router.post('/join', async (req, res) => {
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

module.exports = router;