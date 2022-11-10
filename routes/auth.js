const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');
const User = require('../models/user');

const router = express.Router();

router.post('/join', isNotLoggedIn, async(req, res, next)=>{
    const {userid, password} = req.body;
    try{
        const exUser = await User.findOne({where: { userid }});
        if(exUser){
            return res.status(400).json({
              message: "already existed"  
            })
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            userid,
            password: hash,
        });
        return res.sendStatus(201);
    } catch(error){
        console.error(error);
        return next(error);
    }
});

module.exports = router;