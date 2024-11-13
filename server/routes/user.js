const {User} = require('../models/user');
const {ImageUpload} = require('../models/imageUpload');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt= require("jsonwebtoken");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const fs = require('fs');


var imagesArr = [];
var userEditId;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`);
    }
  })
  const upload = multer({ storage: storage })
cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.cloudinary_Config_api_secret,
    secure: true
});

router.post(`/upload`, upload.array("images"), async (req, res) => {
    console.log(req.files);
    imagesArr=[];
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }
        for(let i=0; i<req.files.length;i++){
            const options={
                use_filename: true,
                unique_filename: false,
                overwrite: false,
            };
            const img = await cloudinary.uploader.upload(req.files[i].path, options, function (error, result){
                imagesArr.push(result.secure_url);
                fs.unlinkSync(`uploads/${req.files[i].filename}`);
            });
        }
        let imagesUploaded = new ImageUpload({
            images: imagesArr,
        })
        imagesUploaded = await imagesUploaded.save();
        return res.status(200).json(imagesArr);
    }catch(error){
        console.log(error);
    }
});
router.post('/signup', async (req, res) => {
    const {name, phone, email, password,isAdmin} = req.body;

    try{
        const existingUser = await User.findOne({email: email});
        const existingUserByPhone = await User.findOne({phone: phone});
        if(existingUser && existingUserByPhone){
            res.status(400).json({error: true, msg: "User already exists!"});
        }
        const hashPassword = await bcrypt.hash(password,10);
        const result = await User.create({
            name: name,
            phone: phone,
            email: email,
            password: hashPassword,
            isAdmin: isAdmin
        })

        const token = jwt.sign({email: result.email, id: result._id}, process.env.JSON_WEB_TOKEN_SECRET_KEY);

        res.status(200).json({
            user: result,
            token: token
        })
    }catch(error){
        console.log(error);
        res.status(500).json({error: true, msg: "Something went wrong!"});
    }
});


router.post(`/signIn`,async (req,res)=>{
    const {email, password} = req.body;

    try{
        const existingUser = await User.findOne({email: email});

        if(!existingUser){
            return res.status(404).json({error: true, msg: "User not found!"});
        }
        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if(!matchPassword){
            return res.status(400).json({error: true, msg: "Invailid credentials!"});
        }

        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, process.env.JSON_WEB_TOKEN_SECRET_KEY);
        res.status(200).json({
            user: existingUser,
            token: token,
            msg:"User Authenticated!"
        })
    }catch(error){
        res.status(500).json({error: true, msg: "Something went wrong!"});
    }
});

// router.post('/changePassword/:id', async (req, res) => {
//     const {name, phone, email, password, newPass, images} = req.body;

//     const existingUser = await User.findOne({email: email});

//     if(!existingUser){
//         return res.status(404).json({error: true, msg: "User not found!"});
//     }
//     const matchPassword = await bcrypt.compare(password, existingUser.password);
//     if(!matchPassword){
//         return res.status(400).json({error: true, msg: "Current password wrong!"});
//     }else{
//         let newPassword;
//         if(newPass){
//             newPassword = bcrypt.hashSync(newPass, 10);
//         }else{
//             newPassword = existingUser.passwordHash;
//         }
    
//         const user = await User.findByIdAndUpdate(
//             req.params.id,
//             {
//                 name: name,
//                 phone: phone,
//                 email: email,
//                 password:  newPassword,
//                 images: images
//             },
//             {new: true}
//         )
//         if(!user){
//             res.status(400).send('The user cannot be updated!');
//         }
//         res.send(user);
//     }
   
// });
router.put('/changePassword/:id', async (req, res) => {
    try {
        const {name, phone, email, password, newPass, images} = req.body;
        console.log('Request body:', req.body);  // Log toàn bộ request body
        console.log('Old password:', password);  // Log old password
        console.log('New password:', newPass);   // Log new password
        // Validate input
        if (!email || !password || !newPass) {
            return res.status(400).json({
                error: true,
                msg: "Missing required fields"
            });
        }

        const existingUser = await User.findOne({email: email});

        if (!existingUser) {
            return res.status(404).json({
                error: true,
                msg: "User not found!"
            });
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);
        
        if (!matchPassword) {
            return res.status(400).json({
                error: true,
                msg: "Current password is incorrect!"
            });
        }

        // Hash new password
        const newPassword = await bcrypt.hash(newPass, 10);

        // Update user
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                name: name,
                phone: phone,
                email: email,
                password: newPassword,
                images: images || existingUser.images // Keep existing images if none provided
            },
            {new: true}
        );
        
        if (!user) {
            return res.status(400).json({
                error: true,
                msg: 'Failed to update user!'
            });
        }

        res.status(200).json({
            error: false,
            msg: 'Password changed successfully',
            user
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            error: true,
            msg: "Server error occurred"
        });
    }
});
router.get(`/`, async(req,res)=>{
    const userList = await User.find();
    if(!userList){
        res.status(500).json({success: false});
    }
    res.send(userList);
})

router.get(`/:id`, async(req,res)=>{
    userEditId = req.params.id;
    const user = await User.findById(req.params.id);
    if(!user){
        res.status(500).json({error: true, message: 'The user with the given ID was not found!'});
    }
    res.status(200).send(user);
})

router.delete(`/:id`, (req, res)=>{
    User.findByIdAndDelete(req.params.id).then(user=>{
        if(user){
            return res.status(200).json({success: true, message: 'The user is deleted!'});
        }else{
            return res.status(404).json({success: false, message: 'User not found!'});
        }
    }).catch(err =>{
        return res.status(500).json({success: false, error: err});
    });
});

router.get(`/get/count`, async(req, res)=>{
    const userCount = await User.countDocuments((count)=> count);
    if(!userCount){
        res.status(500).json({success: false});
    }
    res.send({
        userCount: userCount
    });
});

router.put(`/:id`, async(req,res)=>{
    const {name, phone, email} = req.body;

    const userExits = await User.findById(req.params.id);

    if(req.body.password){
        newPassword = bcrypt.hash(req.body.password, 10);
    }else{
        newPassword = userExits.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,{
            name: name,
            phone: phone,
            email: email,
            password: newPassword,
            images: imagesArr
        },
        {new: true}
    )

    if(!user){
        return res.status(400).send('The user cannot be updated!');
    }
    res.send(user);
});

// router.put(`/:id`, async(req,res)=>{
//     const {name, phone, email, password} = req.body;

//     const userExits = await User.findById(req.params.id);
//     let newPassword;
//     if(req.body.password){
//         newPassword = bcrypt.hash(req.body.password, 10);
//     }else{
//         newPassword = userExits.passwordHash;
//     }

//     const user = await User.findByIdAndUpdate(
//         req.params.id,{
//             name: name,
//             phone: phone,
//             email: email,
//             password: newPassword,
//             images: imagesArr
//         },
//         {new: true}
//     )

//     if(!user){
//         return res.status(400).send('The user cannot be updated!');
//     }
//     res.send(user);
// });

router.delete('/deleteImage', async(req, res)=>{
    const imgUrl = req.query.img;
    const urlArr = imgUrl.split('/');
    const image = urlArr[urlArr.length - 1];
    const imageName = image.split('.')[0];
    const response = await cloudinary.uploader.destroy(imageName, (error, result)=>{

    });
    if(response){
        res.status(200).send(response);
    }
})


module.exports = router;
