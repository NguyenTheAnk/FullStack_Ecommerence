const {SubCategory} = require('../models/subCat');
const express = require('express');
const router = express.Router();
const pLimit = require('p-limit');

var subCategoryEditId;
router.get(`/`, async (req, res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const perPage = req.query.perPage;
        const totalPosts = await SubCategory.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if(page > totalPages){
            return res.status(404).json({message: "No data found!"})
        }

        let subCategoryList = [];
        if(req.query.page !==undefined && req.query.perPage !==undefined){
            subCategoryList = await SubCategory.find().populate('category')
            .skip((page -1)* perPage)
            .limit(perPage)
            .exec();
        }
        else{
            subCategoryList = await SubCategory.find()
            .populate('category')
            .exec();
        }
        

        if(!subCategoryList){
            res.status(500).json({success: false})
        }

        return res.status(200).json({
            "subCategoryList": subCategoryList,
            "totalPages": totalPages,
            "page": page
        });

    }catch(error){
        res.status(500).json({success: false})
    }

});

router.get(`/:id`, async (req, res) => {
    subCategoryEditId = req.params.id;
    const subCategory = await SubCategory.findById(req.params.id);

    if(!subCategory){
        res.status(500).json({message: 'The sub category with th given ID was not found'})
    }
    return res.status(200).send(subCategory);
})
router.post('/create', async (req, res) => {

    subCat = new SubCategory({
        category: req.body.category,
        subCat: req.body.subCat
    });
    subCat = await subCat.save();
    if(!subCat){
        res.status(500).json({
            error: err,
            success: false
        })
    }
    res.status(201).json(subCat);
});

router.delete(`/:id`, async (req, res) => {
    const deletedSubCat = await SubCategory.findByIdAndDelete(req.params.id);
    if(!deletedSubCat){
        res.status(404).json({
            message: 'Sub Category not found!',
            success: false
        })
    }

    res.status(200).json({
        success: true,
        message: 'Sub Category Deleted!'
    })
});
router.get(`/:id`, async (req, res) => {
    subCategoryEditId = req.params.id;
    const subCat = await SubCategory.findById(req.params.id);
    // .populate('category subCat');

    if(!subCat){
        res.status(500).json({message: 'The sub Category with th given ID was not found'})
    }
    return res.status(200).send(subCat);
});
router.put('/:id', async (req, res) => {


    const subCat = await SubCategory.findByIdAndUpdate(
        req.params.id,{
              category: req.body.category,
              subCat: req.body.subCat
        },
        {new: true}
        )
        if(!subCat) {
            return res.status(500).json({
                message: 'Sub Category cannot be updated',
                success: false
            })
        }
        res.send(subCat);
});


module.exports = router;