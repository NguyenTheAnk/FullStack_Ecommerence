const express = require('express');
const { ImageUpload } = require('../models/imageUpload');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const imageUploadList = await ImageUpload.find();
        if (!imageUploadList) {
            return res.status(404).json({ success: false});
        }
        return res.status(200).json(imageUploadList);
    } catch (error) {
        return res.status(500).json({ success: false});
    }
});


router.delete('/deleteAllImages', async (req, res) => {
    try {
        const images = await ImageUpload.find();
        let deletedImage;
        if(images.length !== 0) {
            for(image of images) {
                deletedImage = await ImageUpload.findByIdAndDelete(image.id);
            }
        }
        res.json(deletedImage);
    } catch (error) {
        return res.status(500).json({ success:false });
    }
});

module.exports = router;
