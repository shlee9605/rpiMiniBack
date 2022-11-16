const express = require('express');
const multer = require('multer');
const path = require('path');
const {isLoggedIn} = require('./middlewares');   //login middleware
const fs = require('fs');
const { verifyToken } = require('./middlewares')


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
            console.log("upload",1)
            cb(null, 'uploads/');
        },
        filename(req, file, cb){
            console.log("upload",2)
            const ext = path.extname(file.originalname);
            console.log(ext);
            cb(null, path.basename(file.originalname, ext)+Date.now() + ext);
        },
    }),
    limits: {fileSisze: 5 * 1024 * 1024},
});

const { Key } = require('../models');   //key DB


router.post('/', upload.fields([{name: 'key'}, {name: 'img0'}, {name: 'img1'}, {name: 'img2'}, {name: 'img3'}]), async (req, res, next)=>{ //get pic and save from raspi

    const{key, winlose, userid} = req.body;
    const photoURL1=req.files.img0[0].filename;
    const photoURL2=req.files.img1[0].filename;
    const photoURL3=req.files.img2[0].filename;
    const photoURL4=req.files.img3[0].filename;
 
    try{
        await Key.create({
            key,
            photoURL1,
            photoURL2,
            photoURL3,
            photoURL4,
            winlose,
        });
        return res.sendStatus(201);
    } catch(error){
        console.error(error);
        return next(error);
    }
});

router.get('/read', verifyToken, async(req, res, next)=>{     //for photo
    try{                                        
        const keys = await Key.findAll({        //READ BY ID FROM KEY SQL
            where:{
                userid: req.decoded.id
            }
        })
        return res.status(201).json({
            keys
        })
    } catch(error){
        return res.sendStatus(500);
    }
});

router.get('/read/all', verifyToken, async(req, res, next)=>{    //read all
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

router.patch('/patch', verifyToken, async(req, res, next)=>{ //update profile by key value
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