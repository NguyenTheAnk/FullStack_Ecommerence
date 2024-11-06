const {MyList} = require('../models/myList');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) => {
    try{
       
        const myList = await MyList.find(req.query);

        if(!myList){
            res.status(404).json({success: false})
        }

        return res.status(200).json(myList);

    }catch(error){
        res.status(500).json({success: false})
    }

});

router.delete(`/:id`, async (req, res) => {
    const item = await MyList.findById(req.params.id);
    if(!item){
        res.status(404).json({error: true, msg: 'The item given id is not found!'});
    }
    const deletedItem = await MyList.findByIdAndDelete(req.params.id);
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

router.post('/add', async (req, res) => {
    const item = await MyList.find({productId: req.body.productId,userId: req.body.userId});
    if(item.length===0){
        let list = new MyList({
            productTitle: req.body.productTitle,
            image: req.body.image,
            rating: req.body.rating,
            price: req.body.price,
            productId: req.body.productId,
            userId: req.body.userId,
    
        });
        if(!list){
            res.status(500).json({
                error: err,
                success: false
            })
        }
        list = await list.save();
        
        res.status(201).json(list);
    }else{
        res.status(401).json({error: true, msg: 'Product already added in the my list!'});
    }
    
});
router.get(`/:id`, async (req, res) => {
    const item = await MyList.findById(req.params.id);
 
    if(!item){
     res.status(500).json({error: true, msg: 'The item given id is not found!'});
     }
     res.status(200).json(item);
    }
 );

module.exports = router;


