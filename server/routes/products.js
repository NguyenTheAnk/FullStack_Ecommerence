const {Category} = require('../models/category.js');
const {Product} = require('../models/products.js');
const {RecentlyViewd} = require('../models/RecentlyViewd.js');
const {ImageUpload} = require('../models/imageUpload');
const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const fs = require('fs');
const { isBuffer } = require('util');
const { error } = require('console');
const { console } = require('inspector');

var imagesArr = [];
var productEditId;
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
    cloud_name: process.env.clouddinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_api_key,
    api_secret: process.env.clouddinary_Config_api_secret,
    secure: true
});
router.post(`/upload`, upload.array("images"), async (req, res) => {
    // let images;
    // if(productEditId!== undefined){
    //     const product = await Product.findById(productEditId);
    //     if(product){
    //         images = product.images;
    //     }
       

    // }
    // imagesArr=[]; 
    // const files = req.files;
    // try{
    //     for (let i = 0; i < files.length; i++) {
    //         imagesArr.push(files[i].filename);
    //     }

    //     // Nếu có ảnh cũ, xóa từng ảnh một
    //     if(images.length!==0){
    //         for(image of images){
    //             fs.unlinkSync(`uploads/${image}`);
    //         }
    //         productEditId="";
    //     }

    //     // Cập nhật sản phẩm với các ảnh mới
    //     if (product) {
    //         product.images = imagesArr;
    //         await product.save();
    //     }

    //     res.send(imagesArr);
    // }catch(error){
    //     console.error("Có lỗi xảy ra:", error);
    //     res.status(500).send("Có lỗi xảy ra trong quá trình cập nhật ảnh");
    // }


    // // imagesArr=[];
    // // try{

    // // }catch(error){

    // // }
    imagesArr=[];
    try {
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

// router.get(`/`, async (req, res) => {

//     try{
//         const catName = req.query.catName;
//         // const subCatId = req.query.subCatId;
//         const page = parseInt(req.query.page) || 1;
//         const perPage = parseInt(req.query.perPage) || 10;
//         // const totalPosts = await Product.countDocuments();
//         // const totalPages = Math.ceil(totalPosts / perPage);

//         // if(page > totalPages){
//         //     return res.status(404).json({message: "Page not found"})
//         // }
//         let query = {};
//         if (catName) {
//             query.catName = catName;
//         }
//         const totalPosts = await Product.countDocuments(query);
//         const totalPages = Math.ceil(totalPosts / perPage);
//         if (page > totalPages) {
//             return res.status(404).json({ message: "Page not found" });
//         }
        
//             const productList = await Product.find(query)
//             .populate('category subCat')
//             .skip((page -1)* perPage)
//             .limit(perPage)
//             .exec();

//         // let productList = [];
//         // if(req.query.catName!== undefined){
//         //     productList = await Product.find({catName: req.query.catName})
//         //      .populate('category subCat')
//         // }
//         // else{
//         //     productList = await Product.find()
//         //     .populate('category subCat')
//         //     .skip((page -1)* perPage)
//         //     .limit(perPage)
//         //     .exec();
//         // }
//         // if(req.query.subCatId!== undefined){
//         //     productList = await Product.find({subCatId: req.query.subCatId})
//         //      .populate('category subCat')
//         // }
//         // else{
//         //     productList = await Product.find()
//         //     .populate('category subCat')
//         //     .skip((page -1)* perPage)
//         //     .limit(perPage)
//         //     .exec();
//         // }
//         if(!productList){
//             res.status(500).json({success: false})
//         }

//         return res.status(200).json({
//             "productList": productList,
//             "totalPages": totalPages,
//             "page": page
//         });

//     }catch(error){
//         res.status(500).json({success: false})
//     }

// });
// router.get(`/`, async (req, res) => {
//     try {
//         const catId = req.query.catId; // có thể không cần nếu bạn đang sử dụng categoryId
//         const subCatId = req.query.subCatId; // thêm dòng này để lấy subCatId từ query
//         const page = parseInt(req.query.page) || 1;
//         const perPage = 10;

//         let query = {};
//         if (catId) {
//             query.catId = catId; // nếu bạn sử dụng catName
//         }
//         if (subCatId) {
//             query.subCatId = subCatId; // thêm điều kiện lọc theo subCatId
//         }
//         const totalPosts = await Product.countDocuments(query);
//         const totalPages = Math.ceil(totalPosts / perPage);
//         if (page > totalPages) {
//             return res.status(404).json({ message: "Page not found" });
//         }
//         let productList = [];
//         if(req.query.minPrice !== undefined && req.query.maxPrice !== undefined){
//             productList = await Product.find({catId: req.query.catId}).populate("category subCat") .skip((page - 1) * perPage) // Bỏ qua các bản ghi không thuộc trang hiện tại
//             .limit(perPage).exec();

//             const filteredProducts = productList.filter(product=>{
//                 if(req.query.minPrice && product.price <parseInt(++req.query.minPrice)){
//                     return false;
//                 }
//                 if(req.query.maxPrice && product.price > parseInt(+req.query.maxPrice)){
//                     return false;
//                 }
//                 return true;
//             })

//             if (!productList) {
//                 res.status(500).json({ success: false });
//             }
    
//             return res.status(200).json({
//                 productList: filteredProducts,
//                 totalPages: totalPages,
//                 page: page,
//             });
//         }else{
//             productList = await Product.find(req.query).populate('category subCat').skip((page - 1) * perPage)
//             .limit(perPage).exec();
//             if(!productList){
//                 res.status(500).json({ success: false });
//             }
//             return res.status(200).json({
//                 "productList": productList,
//                 "totalPages": totalPages,
//                 "page": page
//             });
//         }
        

//         // productList = await Product.find(query)
//         //     .populate('category subCat')
//         //     .skip((page - 1) * perPage)
//         //     .limit(perPage)
//         //     .exec();
       
       
//     } catch (error) {
//         res.status(500).json({ success: false });
//     }
// });
router.get(`/`, async (req, res) => {
    try {
        const catId = req.query.catId;
        const subCatId = req.query.subCatId;
        const brand = req.query.brand;
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) ||10;

        // Khởi tạo điều kiện lọc dựa vào catId và subCatId nếu có
        let query = {};
        if (catId) {
            query.catId = catId;
        }
        if (subCatId) {
            query.subCatId = subCatId;
        }
        if (brand) {
            query.brand = brand;
        }
        

        // Thêm điều kiện lọc theo giá nếu có minPrice và maxPrice
        if (req.query.minPrice !== undefined || req.query.maxPrice !== undefined) {
            query.price = {};
            if (req.query.minPrice) query.price = parseInt(req.query.minPrice);
            if (req.query.maxPrice) query.price = parseInt(req.query.maxPrice);
        }

        // Đếm tổng số sản phẩm phù hợp với điều kiện lọc
        const totalPosts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalPosts / perPage);

        // Kiểm tra nếu trang yêu cầu vượt quá tổng số trang
        if (page > totalPages) {
            return res.status(404).json({ message: "Page not found" });
        }

        // Lấy danh sách sản phẩm cho trang hiện tại với điều kiện lọc và phân trang
        const productList = await Product.find(query)
            .populate("category subCat")
            .skip((page - 1) * perPage)
            .limit(perPage);

        // Kiểm tra và trả về nếu không có sản phẩm
        if (!productList) {
            return res.status(500).json({ success: false, message: "No products found" });
        }

        // Trả về danh sách sản phẩm, tổng số trang, và trang hiện tại
        return res.status(200).json({
            productList: productList,
            totalPages: totalPages,
            page: page,
            perPage: perPage,
            totalItems: totalPosts, // Tổng số bản ghi phù hợp
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get(`/featured`, async (req, res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) ||10;
        const totalPosts = await Product.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if(page > totalPages){
            return res.status(404).json({message: "Page not found"})
        }
        const productList = await Product.find({isFeatured: true})
            .populate('category subCat')
            .skip((page -1)* perPage)
            .limit(perPage)
            .exec();
        if(!productList){
            res.status(500).json({success: false})
        }

        return res.status(200).json({
            "productList": productList,
            "totalPages": totalPages,
            "page": page
        });

    }catch(error){
        res.status(500).json({success: false})
    }

});
router.get(`/recentlyViewd`, async (req, res) => {
    let productList =[];
    productList = await RecentlyViewd.find(req.query).populate("category subCat");

    if(!productList){
        res.status(500).json({success: false});
    }
    return res.status(200).json({productList});
});
router.post(`/recentlyViewd`, async (req, res) => {
    let findProduct = RecentlyViewd.find({prodId: req.query.prodId});
    let product;
    if(findProduct.length===0){
        product = new RecentlyViewd({
            prodId: req.query.prodId,
            name: req.body.name,
            subCat: req.body.subCat,
            description: req.body.description,
            images:imagesArr,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            oldPrice: req.body.oldPrice,
            subCatId: req.body.subCatId,
            catId: req.body.catId,
            discount: req.body.discount,
            productRAMS: req.body.productRAMS,
            productWeight: req.body.productWeight,
            productSize: req.body.productSize,
            rating: req.body.rating,
            isFeatured: req.body.isFeatured,
            dateCreated: req.body.dateCreated,
            location: req.body.location,
        });
        product= await product.save();
        if(!product){
            res.status(500).json({
                error: err,
                success: false
            })
        }
    res.status(200).json({product});
    }
    
   
   
});

router.post(`/create`, async (req, res) => {
    
    const category = await Category.findById(req.body.category);
    if(!category){
        return res.status(404).send("invalid category!");
    }
    const images_Array = [];
    const uploadedImages = await ImageUpload.find();
    const images_Arr = uploadedImages?.map((item)=>{
        item.images?.map((image)=>{
            images_Array.push(image);
            console.log(image);
        })
    })

    product = new Product({
        name: req.body.name,
        subCat: req.body.subCat,
        description: req.body.description,
        images:imagesArr,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        oldPrice: req.body.oldPrice,
        subCatId: req.body.subCatId,
        catId: req.body.catId,
        discount: req.body.discount,
        productRAMS: req.body.productRAMS,
        productWeight: req.body.productWeight,
        productSize: req.body.productSize,
        rating: req.body.rating,
        isFeatured: req.body.isFeatured,
        dateCreated: req.body.dateCreated,
        location: req.body.location,
    });
    
    product= await product.save();
    if(!product){
        res.status(500).json({
            error: err,
            success: false
        })
    }
    imagesArr=[];
    res.status(201).json(product);
});

router.delete(`/:id`, async (req, res) => {

    const product = await Product.findById(req.params.id);
    const images = product.images;
    for(img of images){
        const imgUrl = img;
        const urlArr = imgUrl.split('/');
        const image = urlArr[urlArr.length - 1];
        const imageName = image.split('/')[0];
        if(imageName){
            cloudinary.uploader.destroy(imageName, (error, result) =>{});
        }
    }
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if(!deletedProduct){
        res.status(404).json({
            message: 'Product not found!',
            success: false
        })
    }

    res.status(200).json({
        success: true,
        message: 'Product Deleted!'
    })
    
});

router.get(`/:id`, async (req, res) => {
    productEditId = req.params.id;
    const product = await Product.findById(req.params.id).populate("category subCat");
    // .populate('category subCat');

    if(!product){
        res.status(500).json({message: 'The product with th given ID was not found'})
    }
    return res.status(200).send(product);
});


router.put('/:id', async (req, res) => {

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            subCat: req.body.subCat,
            description: req.body.description,
            images:req.body.images || [],
            brand: req.body.brand,
            price: req.body.price,
            oldPrice: req.body.oldPrice,
            subCatId: req.body.subCatId,
            catId: req.body.catId,
            category: req.body.category,
            countInStock: req.body.countInStock,
            discount: req.body.discount,
            productRAMS: req.body.productRAMS,
            productWeight: req.body.productWeight,
            productSize: req.body.productSize,
            rating: req.body.rating,
            isFeatured: req.body.isFeatured,
            dateCreated: req.body.dateCreated,
            location: req.body.location
        },
        {new: true}
        );
        if(!product) {
            res.status(404).json({
                message: 'Product cannot be updated',
                status: false
            })
        }
        res.send(product);
});
router.delete('/deleteImage', async(req, res)=>{
    const imgUrl = req.query.img;
    const urlArr = imgUrl.split('/');
    const image = urlArr[urlArr.length - 1];
    const imageName = image.split('.')[0];
    const response = await cloudinary.uploader.destroy(imageName, (error, result)=>{

    });
    if(response){
        res.status(200).send(response);
    }
})
module.exports = router;