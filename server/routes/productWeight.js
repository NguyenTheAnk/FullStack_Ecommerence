const {ProductWeight} = require ("../models/productWeight");
const express = require ("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
    try{
        const productWeighttList = await ProductWeight.find();
        if(!productWeighttList){
            res.status(500).json({success: false});
        }
        return res.status(200).json(productWeighttList);

    }catch(error){
        res.status(500).json({success: false})
    }

});

router.get(`/:id`, async (req, res) => {
    const item = await ProductWeight.findById(req.params.id);

    if(!item){
        res.status(500).json({message: 'The product Weight with th given ID was not found'})
    }
    return res.status(200).send(item);
})
router.post('/create', async (req, res) => {

    let productWeight = new ProductWeight({
        productWeight: req.body.productWeight
    });

    if(!productWeight){
        res.status(500).json({
            error: err,
            success: false
        })
    }

    productWeight = await productWeight.save();

    res.status(201).json(productWeight);
});

router.delete(`/:id`, async (req, res) => {
    const deletedItem = await ProductWeight.findByIdAndDelete(req.params.id);
    if(!deletedItem){
        res.status(404).json({
            message: 'Item not found!',
            success: false
        })
    }

    res.status(200).json({
        success: true,
        message: 'Item Deleted!'
    })
});

router.put('/:id', async (req, res) => {


    const productWeight = await ProductWeight.findByIdAndUpdate(
        req.params.id,{
            productWeight: req.body.productWeight
        },
        {new: true}
        )
        if(!productWeight) {
            return res.status(500).json({
                message: 'Product Weight cannot be updated',
                success: false
            })
        }
        res.send(productWeight);
});


module.exports = router;
