const passport= require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/user');

module.exports=()=>{
    passport.use(new LocalStrategy({    //passport field must be accurate
        usernameField: 'userid',
        passwordField: 'password',
    }, async(userid, password, done)=>{ 
        try{
            const exUser = await User.findOne({where: {userid}});       //check if registerd member
            if(exUser){
                const result = await bcrypt.compare(password, exUser.password); //hash password
                if(result){                                             //done Id
                    done(null, exUser);
                }else{
                    done(null, false, {message: '비밀번호가 일치하지 않습니다.'});
                }
            } else{
                done(null, false, {message: '가입되지 않은 회원입니다.'});
            }
        } catch(error){     //if id&password field error
            console.error(error);
            done(error);
        }
    }));
};

