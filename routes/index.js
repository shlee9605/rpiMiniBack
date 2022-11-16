const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');       //for login

const bcrypt = require('bcrypt');           //for hash

const {isLoggedIn, isNotLoggedIn} = require('./middlewares');   //login middleware

const User=require('../models/user');       //get User SQL Table
const e = require('express');

const router = express.Router();            //use router


// 로컬 로그인 api
router.post('/login', async (req, res) => {
    const { userid, password } = req.body;
    console.log(userid, password);
    // id = id.toLowerCase();
    const validId = await User.findOne({ where: { userid } });
    try {
      // 클라이언트가 입력한 ID의 유효성 체크
      if (!validId) {
        return res.sendStatus(404);
      }
      // 클라이언트가 입력한 pw와 db에 저장된 암호화된 비밀번호를 비교 후 일치하면 값이 담김.
      const validPassword = await bcrypt.compare(password, validId.password)
      if (validPassword) {
        const token = jwt.sign({
          id:userid,
        }, process.env.JWT_SECRET, {
          expiresIn: '30000m', // 테스트용이여서 일단 길게 했습니다. 
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
        // 비밀번호 불일치 400(Bad Request)
        return res.sendStatus(400);
      }
    } catch (error) {
      return res.sendStatus(404);
    }
  })



// router.post('/login', isNotLoggedIn, (req, res, next)=>{        //user login
//     passport.authenticate('local', (authError, user, info)=>{   //via passport to localstrategy
//         if(authError){                          //localstrategy error
//             console.error(authError);
//             return next(authError);
//         }
//         if(!user){                              //password not matched
//             return res.redirect(`/?loginError=${info.message}`);
//         }
//         return req.login(user, (loginError)=>{  
//             if(loginError){                     //passport deserializer error
//                 console.error(loginError);
//                 return next(loginError);
//             }
//             return res.sendStatus(200);
//             // return res.redirect('/');           //if no error, redirect to home
//         });
//     })(req, res, next);
    
// });

router.get('/logout', isLoggedIn, (req, res)=>{ //user logout
    req.logout()
    req.session.destroy();          //distroy cookie session
    res.redirect('/');
});

module.exports = router;