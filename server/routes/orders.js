const {Orders} = require('../models/orders');
const express = require('express');
const router = express.Router();
const pLimit = require('p-limit');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');


router.get(`/`, async (req, res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const perPage = req.query.perPage;
        const totalPosts = await Orders.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if(page > totalPages){
            return res.status(404).json({message: "No data found!"})
        }

        let ordersList = [];
        if(req.query.page !==undefined && req.query.perPage !==undefined){
            ordersList = await Orders.find()
            .skip((page -1)* perPage)
            .limit(perPage)
            .exec();
        }
        else{
            ordersList = await Orders.find()
            .exec();
        }

        if(!ordersList){
            res.status(500).json({success: false})
        }

        return res.status(200).json({
            "ordersList": ordersList,
            "totalPages": totalPages,
            "page": page
        });

    }catch(error){
        res.status(500).json({success: false})
    }

});

router.get(`/:id`, async (req, res) => {
    const order = await Orders.findById(req.params.id);

    if(!order){
        res.status(500).json({message: 'The order with th given ID was not found'})
    }
    return res.status(200).send(order);
})

router.delete(`/:id`, async (req, res) => {
    const deletedOrders = await Orders.findByIdAndDelete(req.params.id);
    if(!deletedOrders){
        res.status(404).json({
            message: 'Order not found!',
            success: false
        })
    }

    res.status(200).json({
        success: true,
        message: 'Order Deleted!'
    })
});

router.post('/create', async (req, res) => {
    let order = new Orders({
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        pincode: req.body.pincode,
        amount: req.body.amount,
        email: req.body.email,
        userId: req.body.userId,
        paymentId: req.body.paymentId,
        products: req.body.products,
    });
    order = await order.save();
    if(!order){
        res.status(500).json({
            error: err,
            success: false
        })
    }
    res.status(201).json(order);
});


router.put('/:id', async (req, res) => {


    const order = await Orders.findByIdAndUpdate(
        req.params.id,{
            name: req.body.name,
            phoneNumber: req.body.phoneNumber,
            address: req.body.address,
            pincode: req.body.pincode,
            amount: req.body.amount,
            email: req.body.email,
            userId: req.body.userId,
            paymentId: req.body.paymentId,
            products: req.body.products,
        },
        {new: true}
        )
        if(!order) {
            return res.status(500).json({
                message: 'Order cannot be updated',
                success: false
            })
        }
        res.send(order);
});
module.exports = router;

