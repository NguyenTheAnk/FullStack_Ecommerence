const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt= require("jsonwebtoken");

router.post('/signup', async (req, res) => {
    const {name, phone, email, password} = req.body;

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
            password: hashPassword
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

router.get(`/`, async(req,res)=>{
    const userList = await User.find();
    if(!userList){
        res.status(500).json({success: false});
    }
    res.send(userList);
})

router.get(`/:id`, async(req,res)=>{
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
    const {name, phone, email, password} = req.body;

    const userExits = await User.findById(req.params.id);
    let newPassword;
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
            password: newPassword
        },
        {new: true}
    )

    if(!user){
        return res.status(400).send('The user cannot be updated!');
    }
    res.send(user);
});
module.exports = router;
