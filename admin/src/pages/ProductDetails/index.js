import { Chip, emphasize, styled } from "@mui/material";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from "react";
// import Slider from "react-slick";
import { MdBrandingWatermark } from "react-icons/md";
import { BiSolidCategoryAlt } from "react-icons/bi";
// import { MdFilterVintage } from "react-icons/md";
// import { IoIosColorPalette } from "react-icons/io";
import { SiZerodha } from "react-icons/si";
import { IoIosPricetags } from "react-icons/io";
import { IoMdCart } from "react-icons/io";
import { GiStarsStack } from "react-icons/gi";
import { FaCheckCircle } from "react-icons/fa";
import LinearProgress from '@mui/material/LinearProgress';
import UserAvatarImgComponent from "../../components/userAvatarImg";
import Rating from '@mui/material/Rating';
// import Button from '@mui/material/Button';
// import { FaReply } from "react-icons/fa";
import {useParams} from "react-router-dom";
import { useEffect } from "react";
import { fetchDataFromAPI } from "../../utils/api";
import { useState } from "react";
import ProductZoom from "../../components/ProductZoom"
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

const ProductDetails = () => {

    // const productSliderBig = useRef();
    // const productSliderSml = useRef();
    const [productData, setProductData] = useState();
    const [reviewsData,setReviewsData] = useState([]);
    const {id }= useParams();
      useEffect(()=>{
        window.scroll(0,0);
        fetchDataFromAPI(`/api/products/${id}`).then((res)=>{
            setProductData(res);
        });
        fetchDataFromAPI(`/api/productReviews?productId=${id}`).then((res)=>{
            setReviewsData(res);
        })
        
    },[id])
    return (
        <>
        <div className="right-content w-100">
            <div className="card shadow border-0 w-100 flex-row p-4">
                <h5 className="mb-0">Product View</h5>
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
                    label="Product View"
                    />
                </Breadcrumbs>
            </div>
            <div className="card productDetailsSection">
                <div className="row">
                    <div className="col-md-5">
                        <div className="slideWrapper pt-3 pb-3 pl-4 pr-4">
                            <h6 className="mb-4">Product Gallery</h6>
                            <ProductZoom images={productData?.images} discount={productData?.discount}/>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <div className="pt-3 pb-3 pl-4 pr-4">
                            <h6 className="mb-4">Product Details</h6>

                            <h4>{productData?.name}</h4>

                            <div className="productInfo mt-4">
                                <div className="row mb-2">
                                    <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><MdBrandingWatermark/></span>
                                           <span className="name">Brand </span>
                                    </div>
                                    <div className="col-sm-9">
                                        :<span>{productData?.brand}</span>
                                    </div>
                                    <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><BiSolidCategoryAlt/></span>
                                            <span className="name">Category </span>
                                    </div>
                                    <div className="col-sm-9">
                                        :<span>{productData?.category?.name}</span>
                                    </div>                                  
                                                                   
                                    {
                                        productData?.productSize?.length !== 0 && (
                                            <>
                                                <div className="col-sm-3 d-flex align-items-center">
                                                    <span className="icon"><SiZerodha /></span>
                                                    <span className="name">Size</span>
                                                </div>
                                                <div className="col-sm-9">
                                                    :<span>
                                                        <div className="row">
                                                            <ul className="list list-inline tags sml">
                                                                {
                                                                    productData?.productSize?.map((item, index) => (
                                                                        <li className="list-inline-item" key={index}>
                                                                            <span>{item}</span>
                                                                        </li>
                                                                    ))
                                                                }
                                                            </ul>
                                                        </div>
                                                    </span>
                                                </div>
                                            </>
                                        )
                                    }

                                    {
                                        productData?.productWeight?.length !== 0 && (
                                            <>
                                                <div className="col-sm-3 d-flex align-items-center">
                                                    <span className="icon"><SiZerodha /></span>
                                                    <span className="name">Weight</span>
                                                </div>
                                                <div className="col-sm-9">
                                                    :<span>
                                                        <div className="row">
                                                            <ul className="list list-inline tags sml">
                                                                {
                                                                    productData?.productWeight?.map((item, index) => (
                                                                        <li className="list-inline-item" key={index}>
                                                                            <span>{item}</span>
                                                                        </li>
                                                                    ))
                                                                }
                                                            </ul>
                                                        </div>
                                                    </span>
                                                </div>
                                            </>
                                        )
                                    }

                                    {
                                        productData?.productRAMS?.length !== 0 && (
                                            <>
                                                <div className="col-sm-3 d-flex align-items-center">
                                                    <span className="icon"><SiZerodha /></span>
                                                    <span className="name">RAM</span>
                                                </div>
                                                <div className="col-sm-9">
                                                    :<span>
                                                        <div className="row">
                                                            <ul className="list list-inline tags sml">
                                                                {
                                                                    productData?.productRAMS?.map((item, index) => (
                                                                        <li className="list-inline-item" key={index}>
                                                                            <span>{item}</span>
                                                                        </li>
                                                                    ))
                                                                }
                                                            </ul>
                                                        </div>
                                                    </span>
                                                </div>
                                            </>
                                        )
                                    }

                          
                                   
                                    <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><IoIosPricetags/></span>
                                            <span className="name">Price </span>
                                    </div>
                                    <div className="col-sm-9">
                                        :<span>$ {productData?.price}</span>
                                    </div>
                                    <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><IoMdCart /></span>
                                            <span className="name">Stock </span>
                                    </div>
                                    <div className="col-sm-9">
                                        :<span>{productData?.countInStock}</span>
                                    </div>
                                    <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><GiStarsStack/></span>
                                            <span className="name">Review </span>
                                    </div>
                                    <div className="col-sm-9">
                                        :<span>{reviewsData?.length} Reviews</span>
                                    </div>
                                    <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><FaCheckCircle /></span>
                                            <span className="name">Published </span>
                                    </div>
                                    <div className="col-sm-9">
                                         :<span>{new Date(productData?.dateCreated).toLocaleDateString('en-GB')}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                        
                    </div>
                </div>

                <div className="p-4">
                    <h6 className="mt-4 mb-3"> Product Description</h6>
                    <p>{productData?.description}</p>


                    <br/>
                    <h6 className="mt-4 mb-4"> Rating Analytics </h6>
                    <div className="ratingSection">
                        <div className="ratingRow d-flex align-items-center">
                            <span className="col1">
                                5 star
                            </span>
                            <div className="col2">
                                <div className="progress">
                                    <div className="progress-bar" style={{width: '70%'}}>
                                        <LinearProgress variant="determinate" value={80} />
                                    </div>
                                </div>
                            </div>
                            <span className="col3">
                                (22)
                            </span>         
                        </div>

                        <div className="ratingRow d-flex align-items-center">
                            <span className="col1">
                                4 star
                            </span>
                            <div className="col2">
                                <div className="progress">
                                    <div className="progress-bar" style={{width: '50%'}}>
                                        <LinearProgress variant="determinate" value={80} />
                                    </div>
                                </div>
                            </div>
                            <span className="col3">
                                (12)
                            </span>         
                        </div>
                        <div className="ratingRow d-flex align-items-center">
                            <span className="col1">
                                3 star
                            </span>
                            <div className="col2">
                                <div className="progress">
                                    <div className="progress-bar" style={{width: '65%'}}>
                                        <LinearProgress variant="determinate" value={80} />
                                    </div>
                                </div>
                            </div>
                            <span className="col3">
                                (10)
                            </span>         
                        </div>
                        <div className="ratingRow d-flex align-items-center">
                            <span className="col1">
                                2 star
                            </span>
                            <div className="col2">
                                <div className="progress">
                                    <div className="progress-bar" style={{width: '60%'}}>
                                        <LinearProgress variant="determinate" value={80} />
                                    </div>
                                </div>
                            </div>
                            <span className="col3">
                                (10)
                            </span>         
                        </div>

                        <div className="ratingRow d-flex align-items-center">
                            <span className="col1">
                                1 star
                            </span>
                            <div className="col2">
                                <div className="progress">
                                    <div className="progress-bar" style={{width: '27%'}}>
                                        <LinearProgress variant="determinate" value={80} />
                                    </div>
                                </div>
                            </div>
                            <span className="col3">
                                (5)
                            </span>         
                        </div>
                    </div>

                    <br/>
                    {
                        reviewsData?.length!==0 && 
                        <>
                            <h6 className="mt-4 mb-4"> Customer Reviews </h6>
                            <div className="reviewsSection">
                                {
                                    reviewsData?.length!==0 && reviewsData?.map((review, index)=>{
                                        return(
                                                <div className="reviewsRow">
                                                <div className="row">
                                                    <div className="col-sm-7 d-flex">
                                                        <div className="d-flex  flex-column">
                                                            <div className="userInfo d-flex align-items-center mb-3">
                                                                    <UserAvatarImgComponent img="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" lg={true}/>
                                                                        <div className="info pl-3">
                                                                            <h6>{review?.customerName}</h6>
                                                                            <span>{new Date(review?.dateCreated).toLocaleDateString('en-GB')}</span>
                                                                        </div>
                                                                    </div>
                                                                    <Rating name="read-only" value={review?.customerRating} readOnly size="small"/>
                                                            </div>
                                                    
                                                        
                                                    </div>
                                                    {/* <div className="col-md-5 d-flex align-items-center">
                                                        <div className="ml-auto">
                                                            <Button className="btn-blue btn-big btn-lg ml-auto"> <FaReply/> &nbsp; Reply</Button>
                                                        </div>
                                                    </div> */}
                                                    
                                                    
                                                    <p className="mt-3">{review?.review}</p>

                                                    
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                                
                            </div>
                        </>
                    }
                    
                </div>
                
            </div>
        </div>

        
        </>
    )
}

export default ProductDetails;