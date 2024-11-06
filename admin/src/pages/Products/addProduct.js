import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { Chip, emphasize, styled } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useContext, useEffect, useState } from 'react';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaRegImages } from "react-icons/fa";
import 'react-lazy-load-image-component/src/effects/blur.css';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import {  deleteData, deleteImages, fetchDataFromAPI, postData } from '../../utils/api';
import { MyContext } from '../../App';
import { IoCloseSharp } from "react-icons/io5";
import OutlinedInput from '@mui/material/OutlinedInput';
const StyleBreadrumb= styled(Chip)(({theme})=>{
    const backgroundColor = theme.palette.mode ==='light' 
    ? theme.palette.grey[100]
    : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor,0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const ProductUpload = () => {
    const [catData, setCatData] = useState([]);
    const [subCatData, setSubCatData] = useState([]);
    const [productRAMSData, setProductRAMSData] = useState([]);
    const [productWEIGHTData, setProductWEIGHTData] = useState([]);
    const [productSIZEData, setProductSIZEData] = useState([]);
    const context = useContext(MyContext);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [categoryVal, setCategoryVal] = useState('');
    const [productRams, setProductRAMS] = useState([]);
    const [productWeight, setProductWEIGHT] = useState([]);
    const [productSize, setProductSIZE] = useState([]);
    const [subCategoryVal, setSubCategoryVal] = useState('');
    const [uploading,setUploading] = useState(false);
    const [ratingValue, setRatingValue] = useState(1);
    const [isLoading,setIsLoading] = useState(false);
    // const [files, setFiles]= useState([]);
    const [isFeaturedValue, setIsFeaturedValue] = useState('');
    const [imgFiles, setImgFiles] = useState();
    const [previews, setPreviews] = useState([]);
    // const[isSelectedFiles, setIsSelectedFiles] = useState(false);
    
    const formData = new FormData();
    const history = useNavigate();
    let img_arr= [];
    let uniqueArray=[];
    const [formField, setFormField] = useState({
        name: '',
        subCat:'',
        images: [],
        description: '',
        brand: '',
        price: null,
        oldPrice: null,
        catName: '',
        catId: '',
        subCatId: '',
        category: '',
        countInStock: null,
        discount: null,
        productRAMS:[],
        productWeight:[],
        productSize:[],
        rating: 0,
        isFeatured: null,
    });
    const removeImg= async(index, imgUrl)=>{
        const imgIndex = previews.indexOf(imgUrl);
        deleteImages(`/api/products/deleteImage?img=${imgUrl}`).then((res)=>{
            context.setAlertBox({
                open: true,
                error: false,
                msg: 'Image deleted successfully!'
            })
        })
        if(imgIndex >-1){
            previews.splice(index,1);
        }
    }
    useEffect(() => {
        context.setIsHideSidebarAndHeader(false);
        window.scrollTo(0, 0);
        setCatData(context.catData);
        setSubCatData(context.subCatData);   
        // fetchDataFromAPI("/api/imageUpload").then((res)=>{
        //     res?.map((item)=>{
        //         item?.images?.map((img)=>{
        //             deleteImages(`/api/products/deleteImage?img=${img}`).then((res)=>{
        //                 deleteData("/api/imageUpload/deleteAllImages");
        //             })
        //         })
        //     })
        // })    
        fetchDataFromAPI("/api/productWeight").then((res)=>{
            setProductWEIGHTData(res);
        });
        fetchDataFromAPI("/api/productRAMS").then((res)=>{
            setProductRAMSData(res);
        });
        fetchDataFromAPI("/api/productSize").then((res)=>{
            setProductSIZEData(res);
        });
    },[]);

    useEffect(() =>{
        if(!imgFiles) return;
        let tmp =[];
        for(let i=0;i< imgFiles.length;i++){
            tmp.push(URL.createObjectURL(imgFiles[i]));
        }
        const objectUrls = tmp;
        setPreviews(objectUrls);

        for(let i=0; i< objectUrls.length; i++){
            return()=>{
                URL.revokeObjectURL(objectUrls[i]);
            }
                
        }
    },[imgFiles])

//   const handleChangeCategory = (event) => {
//     setCategoryVal(event.target.value);
//     setFormField(()=> (
//         {
//             ...formField,
//             category: event.target.value
//         }
//     ))
//   };
const handleChangeCategory = (event) => {
    const selectedCategoryId = event.target.value;
    setCategoryVal(selectedCategoryId);
    setFormField(()=> (
                {
                    ...formField,
                    category: event.target.value
                }
            ))
        formField.catId = event.target.value;   
        console.log(event.target.value);       
    // Lọc subcategory theo category đã chọn
    const subCategoriesForSelectedCategory = context.subCatData.subCategoryList.filter(subCat => 
        subCat.category._id === selectedCategoryId
    );
    
    // Cập nhật danh sách subcategory
    setFilteredSubCategories(subCategoriesForSelectedCategory);
    
};

    const selectCat=(cat)=>{
        formField.catName = cat;
    }
  const handleChangeProductRams = (event) => {
    // setProductRAMS(event.target.value);
    // setFormField(()=> (
    //     {
    //         ...formField,
    //         productRAMS: event.target.value
    //     }
    // ))
    const {
        target: { value },
      } = event;
      setProductRAMS(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
      formField.productRAMS = value;
  };
  const handleChangeProductSize = (event) => {
    // setProductSIZE(event.target.value);
    // setFormField(()=> (
    //     {
    //         ...formField,
    //         productSize: event.target.value
    //     }
    // ))
    const {
        target: { value },
      } = event;
      setProductSIZE(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
      formField.productSize = value;
  };
  const handleChangeProductWeight = (event) => {
    // setProductWEIGHT(event.target.value);
    // setFormField(()=> (
    //     {
    //         ...formField,
    //         productWeight: event.target.value
    //     }
    // ))
    const {
        target: { value },
      } = event;
      setProductWEIGHT(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
      formField.productWeight = value;
  };
  const handleChangeSubCategory = (event) => {
    setSubCategoryVal(event.target.value);
    setFormField(()=> (
        {
            ...formField,
            subCat: event.target.value
        }
    ))
    formField.subCatId = event.target.value;
  };
  const handleChangeisFeaturedValue = (event) => {
    setIsFeaturedValue(event.target.value);
    setFormField(()=> (
        {
            ...formField,
            isFeatured: event.target.value
        }
    ))
  };
  
const changeInput= (e) => {
    setFormField(()=> (
        {
            ...formField,
            [e.target.name]: e.target.value
        }
    ))
};




const addProduct = (e)=>{
    e.preventDefault();
    const appendedArray = [...previews, ...uniqueArray];
    img_arr = [];
    formData.append('name',formField.name); 
    formData.append('description',formField.description);
    formData.append('brand',formField.brand);
    formData.append('price',formField.price);
    formData.append('oldPrice',formField.oldPrice);
    formData.append('subCatId',formField.subCatId);
    formData.append('catId',formField.catId);
    formData.append('category',formField.category);
    formData.append('subCat',formField.subCat);
    formData.append('countInStock',formField.countInStock);
    formData.append('rating',formField.rating);
    formData.append('isFeatured',formField.isFeatured);
    formData.append('discount',formField.discount);
    formData.append('productRAMS',formField.productRAMS);
    formData.append('productSize',formField.productSize);
    formData.append('productWeight',formField.productWeight);
    formData.append('images',appendedArray);
    // formData.append('images',appendedArray);
    formField.images = appendedArray;
    
    if(formField.name==="")
        {
            context.setAlertBox({
                open:true,
                error:true,
                msg:'Please add product name!'
            })
            return false;
        }
        if(formField.subCat==="")
            {
                context.setAlertBox({
                    open:true,
                    error:true,
                    msg:'Please select product sub category!'
                })
                return false;
            }
    if(formField.description==="")
        {
            context.setAlertBox({
                open:true,
                error:true,
                msg:'Please add product description!'
            })
            return false;
    }
    if(formField.category==="")
        {
            context.setAlertBox({
                open:true,
                error:true,
                msg:'Please select product category!'
            })
            return false;
        } 
        if(formField.price===null)
            {
                context.setAlertBox({
                    open:true,
                    error:true,
                    msg:'Please add product price!'
                })
                return false;
            } 
            if(formField.oldPrice===null)
                {
                     context.setAlertBox({
                        open:true,
                        error:true,
                        msg:'Please add product oldPrice!'
                    })
                    return false;
                }
                if(formField.isFeatured===null)
                    {
                        context.setAlertBox({
                            open:true,
                            error:true,
                            msg:'Please select product isFeatured!'
                        })
                        return false;
                    }
                    if(formField.countInStock===null)
                        {
                            context.setAlertBox({
                                open:true,
                                error:true,
                                msg:'Please add product countInStock!'
                            })
                            return false;
                        }      
    if(formField.brand==="")
        {
            context.setAlertBox({
                open:true,
                error:true,
                msg:'Please add product brand!'
            })
            return false;
        }
        if(formField.rating===0)
            {
                context.setAlertBox({
                    open:true,
                    error:true,
                    msg:'Please select product rating!'
                })
                return false;
            } 
            setIsLoading(true);
        
            postData('/api/products/create',formField).then(res =>{
                context.setAlertBox({
                        open: true,
                        error: false,
                        msg: 'The product is created!'
                });
                setIsLoading(false);

                deleteData("/api/imageUpload/deleteAllImages");
                history('/products');

            });
    
}

const onChangeFile= async(e, apiEndPoint)=>{
    try{
        // const imgArr = [];
        const files = e.target.files;
        setUploading(true);
        for(var i=0; i < files.length; i++){
            
            if(files[i] && (files[i].type=== 'image/jpeg' || files[i].type==='image/jpg' || files[i].type==='image/png' || files[i].type==='image/webp')){
                const file = files[i];
                formData.append(`images`, file);
            }
            else{
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: 'Please select a valid JPG or PNG image file!'
            })
        }
    }
    }catch(error){
        console.log(error);
    }

    postData(apiEndPoint, formData).then((res)=>{
        fetchDataFromAPI("/api/imageUpload").then((response)=>{
            if(response!==undefined && response!==null && response!== "" && response.length!== 0){
                response.length!==0 && response.map((item)=>{
                    item?.images.length !==0 && item?.images?.map((img)=>{
                        img_arr.push(img);
                    })
                })
            // if (response && Array.isArray(response)) {
            //     response.forEach((item) => {
            //         if (item?.images && Array.isArray(item.images)) {
            //             item.images.forEach((img) => {
            //                 img_arr.push(img);
            //             });
            //         }
            //     });

                uniqueArray = img_arr.filter((item,index)=> img_arr.indexOf(item)===index);
                const appendedArray = [...previews,...uniqueArray];
                setPreviews(appendedArray);
                setTimeout(()=>{
                    setUploading(false);
                    img_arr= [];
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: 'Image uploaded successfully!'
                    })
                },200);
            }
        })
    });
}
    return (
        <>
             <div className="right-content w-100">
                    <div className="card shadow border-0 w-100 flex-row p-4">
                        <h5 className="mb-0">Product Upload</h5>
                        <Breadcrumbs aria-label="breadcrumbs" className="ml-auto breadcrumbs_">
                            <StyleBreadrumb
                                component="a"
                                href="/"
                                label="Home"
                                icon={<HomeIcon fontSize="small" />}
                                />
                                <StyleBreadrumb
                                component="a"
                                 href="/products"
                                label="Products"
                                deleteIcon={<ExpandMoreIcon />}
                                
                            />
                             <StyleBreadrumb
                                label="Product Upload"
                                deleteIcon={<ExpandMoreIcon />}
                            />
                        </Breadcrumbs>
                    </div>

                    <form className='form' onSubmit={addProduct}>
                    <div className='row'>
                        <div className='col-md-12'>
                            <div className='card p-4 mt-0'>
                                <h5 className='mb-4'> Basic Information</h5>
                                <div className='form-group'>
                                    <h6>PRODUCT NAME</h6>
                                    <input type='text' name='name' value={formField.name} onChange={changeInput}/>
                                </div>
                                <div className='form-group'>
                                    <h6>DESCRIPTION</h6>
                                    <textarea rows={7} cols={10} name='description' value={formField.description} onChange={changeInput}/>
                                </div>
                                <div className='row'>
                                    <div className='col'>
                                        <div className='form-group'>
                                        <h6>CATEGORY</h6>
                                        <Select
                                            displayEmpty
                                            inputProps={{'aria-label': 'Without label'}}
                                            value={categoryVal}
                                            onChange={handleChangeCategory}
                                            className='w-100'
                                            
                                            >
                                            <MenuItem value="">
                                                <em value={null}>None</em>
                                            </MenuItem>
                                            {
                                                context.catData?.categoryList?.length!==0 && context.catData?.categoryList?.map((cat,index)=>{
                                                    return (
                                                        <MenuItem className='text-capitalize' value={cat.id} key={index} onClick={()=>selectCat(cat.name)}>{cat.name}</MenuItem>
                                                    )
                                                })
                                            }
                                            
                                    
                                        </Select>
                                        </div>
                                    </div>  
                                    <div className='col'>
                                        <div className='form-group'>
                                        <h6>SUB CATEGORY</h6>
                                        <Select
                                            displayEmpty
                                            inputProps={{'aria-label': 'Without label'}}
                                            value={subCategoryVal}
                                            onChange={handleChangeSubCategory}
                                            className='w-100'
                                            
                                            >
                                            <MenuItem value="">
                                                <em value={null}>None</em>
                                            </MenuItem>

                                            {
                                               filteredSubCategories?.length !== 0 && filteredSubCategories?.map((subCat, index) => {
                                                return (
                                                    <MenuItem className='text-capitalize' value={subCat.id} key={index}>{subCat.subCat}</MenuItem>
                                                );
                                            })
                                            }
                                            
                                    
                                        </Select>
                                        </div>
                                    </div>                              
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>PRICE</h6>
                                            <input type='text' name='price' value={formField.price} onChange={changeInput}/>
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>OLD PRICE</h6>
                                            <input type='text' name='oldPrice' value={formField.oldPrice} onChange={changeInput}/>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>IS FEATURED</h6>
                                            <Select
                                            displayEmpty
                                            inputProps={{'aria-label': 'Without label'}}
                                            value={isFeaturedValue}
                                            onChange={handleChangeisFeaturedValue}
                                            className='w-100'
                                            >
                                            <MenuItem value="">
                                                <em value={null}>None</em>
                                            </MenuItem>
                                            <MenuItem className='text-capitalize' value={true}>True</MenuItem>
                                            <MenuItem className='text-capitalize' value={false}>False</MenuItem>
                                          
                                        </Select>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>PRODUCT STOCK</h6>
                                            <input type='text' name='countInStock' value={formField.countInStock} onChange={changeInput}/>
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>PRODUCT RAMS</h6>
                                            <Select
                                             multiple
                                            displayEmpty
                                            value={productRams}
                                            onChange={handleChangeProductRams}
                                            className='w-100'
                                            
                                            MenuProps={MenuProps}
                                            >
                                            {
                                                productRAMSData?.map((item, index)=>{
                                                    return(
                                                        <MenuItem className='text-capitalize' value={item.productRAMS} key={index}>{item.productRAMS}</MenuItem>
                                                    )
                                                })
                                            }
                                          
                                        </Select>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>PRODUCT WEIGHT</h6>
                                            <Select
                                             multiple
                                            displayEmpty
                                            
                                            MenuProps={MenuProps}
                                            value={productWeight}
                                            onChange={handleChangeProductWeight}
                                            className='w-100'
                                            >
                                            {
                                                productWEIGHTData?.map((item, index)=>{
                                                    return(
                                                        <MenuItem className='text-capitalize' value={item.productWeight} key={index}>{item.productWeight}</MenuItem>
                                                    )
                                                })
                                            }
                                          
                                        </Select>
                                        </div>
                                    </div>
                                    <div className='col'>
                                        <div className='form-group'>
                                            <h6>PRODUCT SIZE</h6>
                                            <Select
                                             multiple
                                            displayEmpty
                                           
                                            MenuProps={MenuProps}
                                            value={productSize}
                                            onChange={handleChangeProductSize}
                                            className='w-100'
                                            >

                                            {
                                                productSIZEData?.map((item, index)=>{
                                                    return(
                                                        <MenuItem className='text-capitalize' value={item.productSize} key={index}>{item.productSize}</MenuItem>
                                                    )
                                                })
                                            }
                                          
                                        </Select>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <h6>BRAND</h6>
                                            <input type='text' name='brand' value={formField.brand} onChange={changeInput}/>
                                        </div>
                                    </div>    
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <h6>DISCOUNT</h6>
                                            <input type='text' name='discount' value={formField.discount} onChange={changeInput}/>
                                        </div>
                                    </div>   
                                    <div className='col-md-4'>
                                        <div className='form-group'>
                                            <h6>RATINGS</h6>
                                            <Rating
                                                name="simple-controlled"
                                                value={ratingValue}
                                                onChange={(event, newValue) => {
                                                    setRatingValue(newValue);
                                                    setFormField(()=> (
                                                        {
                                                            ...formField,
                                                            rating: newValue
                                                        }
                                                    ))
                                                }}
                                                />
                                        </div>
                                    </div>  
                                                             
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className='card p-4 mt-0'>
                                <div className='imageUploadSec'>
                                    <h5 className='mb-4'> Media And Published</h5>
                                    <div className='imgUploadBox d-flex align-items-center'>                             
                                    {
                                        previews?.length!==0 && previews?.map((img, index)=>{
                                            return (
                                                <div className='uploadBox' key={index}>
                                                    <span className='remove' onClick={()=> removeImg(index,img)}><IoCloseSharp/></span>
                                                    <div className='box'>
                                                        <img src={img} className='w-100' alt=''/>
                                                    </div>
                                                </div>
                                                
                                            )
                                        })
                                      }
                                        <div className='uploadBox'>
                                        {
                                                uploading === true ?
                                                <div className='progressBar text-center d-flex align-items-center flex-column'><CircularProgress/>
                                                    <span>Uploading...</span>
                                                 </div>
                                                 :
                                                 <>
                                                    <input type='file' multiple onChange={(e) => onChangeFile(e, '/api/products/upload')} name='images'/>
                                                    <div className='info'>
                                                        <FaRegImages/>
                                                        <h5>Image Upload</h5>
                                                    </div>
                                                 </>
                                            }
                                        </div>
                                    </div>
                                    <br/>
                                    <Button type="submit" className='btn-blue btn-lg btn-big w-100'><FaCloudUploadAlt/> &nbsp; {isLoading===true ? <CircularProgress color="inherit" className="ml-3 loader" /> : 'PUBLISH AND VIEW'} </Button>
                                
                                </div>
                        <br/>
                    </div>
                    </form>
                </div>
        </>
    )
}

export default ProductUpload;