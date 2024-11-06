const mongoose = require('mongoose');

const productRamsSchema = mongoose.Schema({
    productRAMS:{
        type: String,
        default: null
    }
})
productRamsSchema.virtual('id').get(function (){
    return this._id.toHexString();
});

productRamsSchema.set('toJSON', {
    virtuals: true,
});

exports.ProductRAMS=  mongoose.model('ProductRAMS', productRamsSchema);
exports.productRamsSchema = productRamsSchema;