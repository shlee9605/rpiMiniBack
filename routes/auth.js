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
      // 비밀번호 암호화 
      const hash = await bcrypt.hash(password, 12);
      // 간단하게 회원가입 구현이라 email, authCode, status는 제외 했습니다.
      await User.create({
        userid,
        password: hash,
      });
      // 유저정보가 성공적으로 만들어졌다면 201(Created)
      return res.sendStatus(201);
    } catch (error) {
      // 유저 정보 생성에 필요한 정보가 제대로 오지 않았다면 400(Bad Request)
      // console.log('what is wrong');
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