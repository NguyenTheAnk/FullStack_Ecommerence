const {ProductRAMS} = require ("../models/productRAMS");
const express = require ("express");
const router = express.Router();
router.get(`/`, async (req, res) => {
    try{
        const productRamsList = await ProductRAMS.find();
        if(!productRamsList){
            res.status(500).json({success: false});
        }
        return res.status(200).json(productRamsList);

    }catch(error){
        res.status(500).json({success: false})
    }

});

router.get(`/:id`, async (req, res) => {
    const item = await ProductRAMS.findById(req.params.id);

    if(!item){
        res.status(500).json({message: 'The product RAMS with th given ID was not found'})
    }
    return res.status(200).send(item);
})
router.post('/create', async (req, res) => {

    let productRAMS = new ProductRAMS({
        productRAMS: req.body.productRAMS
    });

    if(!productRAMS){
        res.status(500).json({
            error: err,
            success: false
        })
    }

    productRAMS = await productRAMS.save();

    res.status(201).json(productRAMS);
});

router.delete(`/:id`, async (req, res) => {
    const deletedItem = await ProductRAMS.findByIdAndDelete(req.params.id);
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


    const productRAMS = await ProductRAMS.findByIdAndUpdate(
        req.params.id,{
            productRAMS: req.body.productRAMS
        },
        {new: true}
        )
        if(!productRAMS) {
            return res.status(500).json({
                message: 'Product RAMS cannot be updated',
                success: false
            })
        }
        res.send(productRAMS);
});


module.exports = router;
