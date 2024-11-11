const {HomeBannerSlide} = require('../models/homeBanner');
const {ImageUpload} = require('../models/imageUpload');
const express = require('express');
const router = express.Router();
const pLimit = require('p-limit');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const fs = require('fs');


var imagesArr = [];
var homeSlideEditId;
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

router.get(`/`, async (req, res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const perPage = req.query.perPage;
        const totalPosts = await HomeBannerSlide.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if(page > totalPages){
            return res.status(404).json({message: "No data found!"})
        }

        let homeBannerList = [];
        if(req.query.page !==undefined && req.query.perPage !==undefined){
            homeBannerList = await HomeBannerSlide.find()
            .skip((page -1)* perPage)
            .limit(perPage)
            .exec();
        }
        else{
            homeBannerList = await HomeBannerSlide.find()
            .exec();
        }

        if(!homeBannerList){
            res.status(500).json({success: false})
        }

        return res.status(200).json({
            "homeBannerList": homeBannerList,
            "totalPages": totalPages,
            "page": page
        });

    }catch(error){
        res.status(500).json({success: false})
    }

});

router.get(`/:id`, async (req, res) => {
    homeSlideEditId = req.params.id;
    const homeSlide = await HomeBannerSlide.findById(req.params.id);

    if(!homeSlide){
        res.status(500).json({message: 'The home slide with th given ID was not found'})
    }
    return res.status(200).send(homeSlide);
})

router.delete(`/:id`, async (req, res) => {
    const homeSlide = await HomeBannerSlide.findById(req.params.id);
    const images = homeSlide.images;
    for(img of images){
        const imgUrl = img;
        const urlArr = imgUrl.split('/');
        const image = urlArr[urlArr.length - 1];
        const imageName = image.split('/')[0];
        if(imageName){
            cloudinary.uploader.destroy(imageName, (error, result) =>{});
        }
    }
    const deletedHomeSlide = await HomeBannerSlide.findByIdAndDelete(req.params.id);
    if(!deletedHomeSlide){
        res.status(404).json({
            message: 'Home Slide not found!',
            success: false
        })
    }

    res.status(200).json({
        success: true,
        message: 'Home Slide Deleted!'
    })
});

router.post('/create', async (req, res) => {
    const images_Array = [];
    const uploadedImages = await ImageUpload.find();
    const images_Arr = uploadedImages?.map((item)=>{
        item.images?.map((image)=>{
            images_Array.push(image);
            console.log(image);
        })
    })
    newEntry = new HomeBannerSlide({
        images: imagesArr
    });
    newEntry = await newEntry.save();
    if(!newEntry){
        res.status(500).json({
            error: err,
            success: false
        })
    }
   
    imagesArr=[];
    res.status(201).json(newEntry);
});


router.put('/:id', async (req, res) => {


    const homeSlide = await HomeBannerSlide.findByIdAndUpdate(
        req.params.id,{
            images: imagesArr
        },
        {new: true}
        )
        if(!homeSlide) {
            return res.status(500).json({
                message: 'Home Slide cannot be updated',
                success: false
            })
        }
        res.send(homeSlide);
});
router.delete('/deleteImage', async(req, res)=>{
    const imgUrl = req.query.img;
    const urlArr = imgUrl.split('/');
    const imageName = image.split('.')[0];
    const response = await cloudinary.uploader.destroy(imageName, (error, result)=>{

    });
    if(response){
        res.status(200).send(response);
    }
})
module.exports = router;


