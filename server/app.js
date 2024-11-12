const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const pLimit = require('p-limit');
// const authJwt = require('./helper/jwt');

app.use(cors());
app.options('*', cors())

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.json());
// app.use(authJwt());

//Routes
const categoryRoutes = require('./routes/categories');
const subCatRoutes = require('./routes/subCat');
const productRoutes = require('./routes/products');
const imageUploadRoutes = require('./routes/imageUpload');
const productWeightRoutes = require('./routes/productWeight');
const productRamsRoutes = require('./routes/productRams');
const productSizeRoutes = require('./routes/productSize');
const userRoutes = require('./routes/user');
const cart = require('./routes/cart');
const productReviews = require('./routes/productReviews');
const myList = require('./routes/myList');
const orders = require('./routes/orders');
const checkout = require('./routes/checkout');
const homeBanner = require('./routes/homeBanner');
const search = require('./routes/search');



app.use("/uploads", express.static("uploads"));
app.use(`/api/category`,categoryRoutes);
app.use(`/api/subCat`,subCatRoutes);
app.use(`/api/products`,productRoutes);
app.use('/api/imageUpload', imageUploadRoutes);
app.use('/api/productWeight', productWeightRoutes);
app.use('/api/productRAMS', productRamsRoutes);
app.use('/api/productSize', productSizeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cart', cart);
app.use('/api/productReviews', productReviews);
app.use('/api/my-list', myList);
app.use('/api/orders', orders);
app.use('/api/checkout', checkout);
app.use('/api/homeBanner', homeBanner);
app.use('/api/search', search);




//Database
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{
    console.log('Database Connection is ready')

    //Server
    app.listen(process.env.PORT, ()=> {
        console.log(`server is running http://localhost:${process.env.PORT}`);
        })
})
.catch((err) =>{
    console.log(err);
})




