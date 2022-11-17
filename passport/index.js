const passport = require('passport');       //cookie-session passport
const local = require('./localStrategy');
const User = require('../models/user');

module.exports=()=>{                        //passport userid
    passport.serializeUser((user, done)=>{
        done(null, user.id);
    });

    passport.deserializeUser((id, done)=>{
        User.findOne({
            where: {id}
        })
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    local();
};

