const express = require('express');

const passport = require('passport');       //for login

const bcrypt = require('bcrypt');           //for hash

const {isLoggedIn, isNotLoggedIn} = require('./middlewares');   //login middleware

const User=require('../models/user');       //get User SQL Table

const router = express.Router();            //use router

router.post('/login', isNotLoggedIn, (req, res, next)=>{        //user login
    passport.authenticate('local', (authError, user, info)=>{
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError)=>{
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res)=>{
    req.logout()
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;