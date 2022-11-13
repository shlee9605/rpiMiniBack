const express = require('express');

const passport = require('passport');       //for login

const bcrypt = require('bcrypt');           //for hash

const {isLoggedIn, isNotLoggedIn} = require('./middlewares');   //login middleware

const User=require('../models/user');       //get User SQL Table

const router = express.Router();            //use router

router.post('/login', isNotLoggedIn, (req, res, next)=>{        //user login
    passport.authenticate('local', (authError, user, info)=>{   //via passport to localstrategy
        if(authError){                          //localstrategy error
            console.error(authError);
            return next(authError);
        }
        if(!user){                              //password not matched
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user, (loginError)=>{  
            if(loginError){                     //passport deserializer error
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');           //if no error, redirect to home
        });
    })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res)=>{ //user logout
    req.logout()
    req.session.destroy();          //distroy cookie session
    res.redirect('/');
});

module.exports = router;