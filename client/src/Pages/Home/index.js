import HomeBanner from "../../Components/HomeBanner";
import banner1 from '../../assets/images/banner1.jpg';
import banner2 from '../../assets/images/banner3.jpg';
import banner4 from '../../assets/images/banner9.jpg';
import banner5 from '../../assets/images/banner8.jpg';
import newLetterImg from '../../assets/images/banner14.png';
import  Button from '@mui/material/Button';
import { IoIosArrowRoundForward } from "react-icons/io";
import React, { useContext } from "react";
import ProductItem from "../../Components/ProductItem";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import HomeCat from "../../Components/HomeCat";
import { IoMailOutline } from "react-icons/io5";
import { useEffect } from "react";
import { fetchDataFromAPI } from "../../utils/api";
import { useState } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { MyContext } from "../../App";

const Home = () =>{
    const [catData, setCatData]= useState([]);
    const [productsData, setProductsData]= useState([]);
    const [electronicsData, setElectronicData]= useState([]);
    const [selectedCat, setSelectedCat]= useState([]);
    const [filterData, setFilterData]= useState([]);
    const [value, setValue] = React.useState(0);
    const context = useContext(MyContext);
    const handleChange = (event, newValue) => {
        setValue(newValue);
      };
    const selectCat=(cat)=>{
        setSelectedCat(cat);
    }
    useEffect(()=>{
        // setSelectedCat(context.categoryData[0]?.name);
       fetchDataFromAPI("/api/category/").then((res)=>{
            setCatData(res);
            if (res?.categoryList?.length !== 0) {
                setSelectedCat(res.categoryList[0].name);
            }
       });
       fetchDataFromAPI("/api/products/").then((res)=>{
        setProductsData(res);
       
   });
        fetchDataFromAPI("/api/products/featured").then((res)=>{
            setElectronicData(res);
            });
    
    
    },[]);

   
    useEffect(()=>{
        fetchDataFromAPI(`/api/products?catId=${selectedCat}`).then((res)=>{
            setFilterData(res.productList);
        });
       
    },[selectedCat]);
    return (
        <>
                <HomeBanner/>
                {
                    catData?.categoryList?.length!==0 && <HomeCat catData ={catData}/>                  
                }
                

                <section className="homeProducts">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-3">

                                <div className="stickky">
                                    <div className="banner">
                                        <img src={banner1} className="cursor w-100" alt=""/>
                                    </div>
                                    <div className="banner mt-4">
                                        <img src={banner2} className="cursor w-100" alt=""/>
                                    </div>
                                </div>
                               
                            </div>
                            <div className="col-md-9 productRow">
                                <div className="d-flex align-items-center">
                                    <div className="info w-75">
                                        <h3 className="mb-0 hd">BEST SELLER</h3>
                                        <p className="text-light text-sml mb-1">Don't miss out on current offers until the end of December</p>
                                    </div>
                                    <div className="ml-auto">
                                        <Tabs value={value} onChange={handleChange} variant= "scrollable" scrollButtons ="auto" className= "filterTabs">
                                           {
                                            catData?.categoryList?.map((item, index)=>{
                                                return(
                                                    <Tab className="item" label={item?.name} onClick={()=> selectCat(item?.id)}/>
                                                )
                                            })
                                           }
                                           
                                        </Tabs>
                                    </div>
                                    
                                </div>

                                <div className="product_row w-100 mt-4"> 
                                <Swiper 
                                                slidesPerView ={4}
                                                spaceBetween = {20}
                                                navigation= {true}
                                                slidesPerGroup={3}
                                                modules={[Navigation]}
                                                className="mySwiper"
                                            >
                                                {/* {
                                                    productsData?.productList?.length!==0 && productsData?.productList?.map((item, index)=>{
                                                        return (
                                                            <SwiperSlide key={index}>
                                                                <ProductItem item={item}/> 
                                                            </SwiperSlide>
                                                        )
                                                    })
                                                } */}
                                                {
                                                     filterData?.length !== 0 && filterData?.slice()?.reverse()?.map((item, index)=>{
                                                        return (
                                                            <SwiperSlide key={index}>
                                                                <ProductItem item={item}/> 
                                                            </SwiperSlide>
                                                        )
                                                    })
                                                }
                                            
                                         

                                </Swiper>
                                
                                </div>



                                <div className="d-flex align-items-center mt-5">
                                    <div className="info w-75">
                                        <h3 className="mb-0 hd">PRODUCT NEWS</h3>
                                        <p className="text-light text-sml mb-0">New products have been imported to the warehouse</p>
                                    </div>

                                    <Button className="viewAllBtn ml-auto">Views All <IoIosArrowRoundForward/></Button>
                                </div>
                                 
                                <div className="product_row w-100 mt-4"> 
                                <Swiper 
                                                slidesPerView ={4}
                                                spaceBetween = {20}
                                                navigation= {true}
                                                slidesPerGroup={3}
                                                modules={[Navigation]}
                                                className="mySwiper"
                                            >
                                                 {
                                                    productsData?.productList?.length!==0 && productsData?.productList?.map((item, index)=>{
                                                        return (
                                                            <SwiperSlide key={index}>
                                                                <ProductItem item={item}/> 
                                                            </SwiperSlide>
                                                        )
                                                    })
                                                }
                                            
                                         

                                </Swiper>
                                
                                </div>
                                 <div className="d-flex align-items-center mt-4">
                                    <div className="info w-75">
                                        <h3 className="mb-0 hd">ELECTRONICS</h3>    
                                        <p className="text-light text-sml mb-0">Don't miss out on current offers until the end of December</p>
                                    </div>

                                    <Button className="viewAllBtn ml-auto">Views All <IoIosArrowRoundForward/></Button>
                                </div>
                                <div className="product_row w-100 mt-4"> 

                                    <Swiper 
                                                    slidesPerView ={4}
                                                    spaceBetween = {20}
                                                    navigation= {true}
                                                    slidesPerGroup={3}
                                                    modules={[Navigation]}
                                                    className="mySwiper"
                                                >
                                                    {
                                                        electronicsData?.productList?.length!==0 && electronicsData?.productList?.map((item, index)=>{
                                                            return (
                                                                <SwiperSlide key={index}>
                                                                    <ProductItem item={item}/> 
                                                                </SwiperSlide>
                                                            )
                                                        })
                                                    }
                                                
                                            

                                    </Swiper>

                                    </div>
                                <div className="d-flex mt-4 mb-5 bannerSec">
                                    <div className="banner">
                                        <img src={banner4} className="cursor w-100" alt=""/>
                                    </div>
                                    <div className="banner">
                                        <img src={banner5} className="cursor w-100" alt=""/>
                                    </div>
                                </div>
                 
                            </div>
                        </div>
                       
                    </div>
                    
                </section>

                <section className="newsLetterSection mt-3 mb-3 d-flex align-items-center">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-6">
                                            <p className="text-white mb-1">20% off your first order</p>
                                            <h3 className="text-white"> Send us your wishes!</h3>
                                            <p className="text-light">Join our gmail subscription now to get updates on promotions and coupons</p>

                                            <form>
                                                <IoMailOutline/>
                                                <input type="text" placeholder="Your Email Address"/>
                                                <Button>Subscribe</Button>
                                            </form>
                                </div>
                                <div className="col-md-6">
                                    <img src={newLetterImg} alt=""/>
                                </div>
                            </div>
                        </div>
                    </section>

              
        </>
    )
}
export default Home;