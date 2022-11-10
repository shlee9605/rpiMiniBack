const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

try{
    fs.readdirSync('uploads');
} catch(error){
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
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

const { Key } = require('../models');

router.post('/', upload.array('img', 4), async (req, res, next)=>{ //get pic and save from raspi
    const{key, winlose, userid} = req.body;
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

router.get('/read/id', async(req, res, next)=>{     //for photo
    try{                                        
        const keys = await Key.findAll({ 
            where:{
                userid: req.body.userid
            }
        })
        return res.status(201).json({
            keys
        })
    } catch(error){
        return res.sendStatus(500);
    }
});

router.get('/read', async(req, res, next)=>{    //read all
    try{                                       
        const keys = await Key.findAll({   
        })
        return res.status(201).json({
            keys
        })
    } catch(error){
        return res.sendStatus(500);
    }
});

router.patch('/patch', async(req, res, next)=>{ //update profile by key value
    try{                                        
        await Key.update({                      
            userid: req.body.userid             
        }, {where: {key: req.body.key}})        
        return res.sendStatus(201);             
    }catch(error){                              
        console.error(error);
        return next(error);          
    }                                
});

module.exports = router;