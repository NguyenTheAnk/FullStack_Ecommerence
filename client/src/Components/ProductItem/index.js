import  Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import { TfiFullscreen } from "react-icons/tfi";
import { IoMdHeartEmpty } from "react-icons/io";
import {useContext, useRef, useState} from 'react';
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { fetchDataFromAPI, postData } from '../../utils/api';
import { FaHeart } from "react-icons/fa";
const ProductItem =(props)=>{

   const context = useContext(MyContext);
   const [isHovered, setIsHovered] = useState(false);
   const [isLoading,setIsLoading] = useState(false);
   const [isAddedToMyList,setIsAddedToMyList] = useState(false);
   const slideRef = useRef();
   var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: false,
    arrows: false
  };
  
  

   const viewProductDetails = (id)=>{
    context.setisOpenProductModal({
        id: id,
        open: true
    }); 
   }

   const handleMouseEnter = (id)=>{
    if(isLoading===false){
        setIsHovered(true);
        setTimeout(()=>{
            if(slideRef.current){
                slideRef.current.slickPlay();
            }
        },20);
    }
    const user = JSON.parse(localStorage.getItem("user"));
    fetchDataFromAPI(`/api/my-list?productId=${id}&userId=${user?.userId}`).then((res)=>{
        if(res.length!==0){
            setIsAddedToMyList(true);
        }
    })
   
   }
   const handleMouseLeave = ()=>{
    if(isLoading===false){
        setIsHovered(false);
        setTimeout(()=>{
            if(slideRef.current){
                slideRef.current.slickPause();
            }
        },20);
    }
   }
   const addToMyList=(id)=>{
    if (isAddedToMyList) {
        context.setAlertBox({
            open: true,
            error: true,
            msg: "Product already added to My List!",
        });
        return;
    }
    const user = JSON.parse(localStorage.getItem("user"));
    if(user!==undefined && user!==null && user!==""){
        const data ={
            productTitle: props?.item?.name,
            image: props?.item?.images[0],
            rating: props?.item?.rating,
            price: props?.item?.price,
            productId: id,
            userId: user?.userId
        }
            postData(`/api/my-list/add`,data).then((res)=>{
                if(res.status!==401){
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: 'The product added to My List!'
                    })
                    fetchDataFromAPI(`/api/my-list?productId=${id}&userId=${user?.userId}`).then((res)=>{
                        if(res.length!==0){
                            setIsAddedToMyList(true);
                        }
                    })
                }else{
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: res.msg
                    })
                }
               
            })
    }else{
        context.setAlertBox({
            open: true,
            error: true,
            msg: "Please Login to continue!"
        })
    }
   
   }
    return (
        <>
        <div className={`productItem ${props.itemView}`}
           onMouseEnter={() => handleMouseEnter(props?.itemView === 'recentlyView' ? props?.item?.prodId : props?.item?.id)}
            onMouseLeave={handleMouseLeave}
        >
             <div className="img_rapper">
                <Link to={`/product/${props?.itemView==='recentlyView' ? props?.item?.prodId : props?.item?.id}`}>
                <div className='productItemSliderWrapper'>
                    {
                            <Slider {...settings} ref = {slideRef} 
                                className='productItemSlider'
                            >
                                {
                                    props?.item?.images?.map((image, index)=>{
                                        return(
                                            <div className='slick-slide' key={index}>
                                               {/* <LazyLoadImage
                                                     alt={"image"}
                                                     effect="blur"
                                                     className='w-100'
                                                     src={props.item.images[0]} /> */}
                                                     <img src={image}  alt=''/>
                                                    
                                            </div>
                                        )
                                    })
                                }
                            </Slider>
                        }
                </div>
                     {/* <LazyLoadImage
                            alt={"image"}
                            effect="blur"
                            className='w-100'
                             src={props.item.images[0]} /> */}
                </Link>
               
                <span className="badge badge-primary">{props?.item?.discount}%</span>

                <div className="actions">
                <Button onClick={(e) => viewProductDetails(props?.itemView==='recentlyView' ? props?.item?.prodId : props?.item?.id)}><TfiFullscreen/></Button>
                <Button className={isAddedToMyList===true && 'active'} onClick={()=> addToMyList(props?.itemView==='recentlyView' ? props?.item?.prodId : props?.item?.id)}>
                    {
                        isAddedToMyList===true ?  <FaHeart style={{fontSize: '20px'}}/>
                        :
                        <IoMdHeartEmpty style={{fontSize: '20px'}}/>
                    }
                   </Button>
                </div>
            </div>

            <div className="info">
                <Link to={'/product/1'}><h4>{props?.item?.name?.substr(0,30) +'...'}</h4></Link>
                <span className="text-success d-block"> IN STOCK</span>
                <Rating className="mt-2 mb-2" name="read-only" value={props?.item?.rating} readOnly size="small" precision={0.5}/>
                <div className="d-flex">
                    <span className="oldPrice">$ {props?.item?.oldPrice}</span>
                    <span className="netPrice text-danger ml-2">$ {props?.item?.price}</span>
                </div>
            </div>
                                                        
        </div>

       
        {/* { <ProductModal/>} */}
        </>
                                                    
    )
}

export default ProductItem;