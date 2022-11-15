const express = require('express');
const multer = require('multer');
const path = require('path');
const {isLoggedIn} = require('./middlewares');   //login middleware
const fs = require('fs');

const router = express.Router();

try{                            //make upload folder for pic data
    fs.readdirSync('uploads');  //using filesystem lib
} catch(error){
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({             //using multer
    storage: multer.diskStorage({
        destination(req, file, cb){
            cb(null, 'uploads/');
        },
        filename(req, file, cb){
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext)+Date.now()+ext);
        },
    }),
    limits: {fileSisze: 5 * 1024 * 1024},
});

const { Key } = require('../models');   //key DB

router.post('/', upload.array('img', 4), async (req, res, next)=>{ //get pic and save from raspi
    const{key, winlose, userid} = req.body; //CREATE KEY SQL
    const photoURL1=req.files[0].filename;
    const photoURL2=req.files[1].filename;
    const photoURL3=req.files[2].filename;
    const photoURL4=req.files[3].filename;
    console.log(req.body);
    try{
        await Key.create({
            key,
            photoURL1,
            photoURL2,
            photoURL3,
            photoURL4,
            winlose,
            userid,
        });
        return res.sendStatus(201);
    } catch(error){
        console.error(error);
        return next(error);
    }
});

router.get('/read/:userid', isLoggedIn, async(req, res, next)=>{     //for photo
    try{                                        
        const keys = await Key.findAll({        //READ BY ID FROM KEY SQL
            where:{
                userid: req.params.userid
            }
        })
        return res.status(201).json({
            keys
        })
    } catch(error){
        return res.sendStatus(500);
    }
});

router.get('/read', isLoggedIn, async(req, res, next)=>{    //read all
    try{                                       
        const keys = await Key.findAll({        //READ ALL KEY SQL
        })
        return res.status(201).json({
            keys
        })
    } catch(error){
        return res.sendStatus(500);
    }
});

router.patch('/patch', isLoggedIn, async(req, res, next)=>{ //update profile by key value
    try{                                        
        await Key.update({                      //UPDATE KEY SQL  
            userid: req.body.userid             
        }, {where: {key: req.body.key}})        
        return res.sendStatus(201);             
    }catch(error){                              
        console.error(error);
        return next(error);          
    }                                
});

module.exports = router;