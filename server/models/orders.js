const mongoose = require('mongoose');

const ordersSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },   
    phoneNumber: {
        type: String,
        required: true
    },  
    address: {
        type: String,
        required: true
    },  
    pincode: {
        type: String,
        required: true
    },  
    amount: {
        type: Number,
        required: true
    },  
    email: {
        type: String,
        required: true
    },  
    userId: {
        type: String,
        required: true
    },  
    paymentId: {
        type: String,
        required: true
    },  
    products: [
        {
            productName: {
                type: String,
            },
            quantity: {
                type: Number,
            },
            price: {
                type: Number,
            },
            image: {
                type: String,
            },
            total: {
                type: Number,
            }
        }
    ],  
    date: {
        type: Date,
       default: Date.now
    },  
})

ordersSchema.virtual('id').get(function (){
    return this._id.toHexString();
});

ordersSchema.set('toJSON', {
    virtuals: true,
});

exports.Orders = mongoose.model('Orders', ordersSchema);
exports.ordersSchema = ordersSchema;