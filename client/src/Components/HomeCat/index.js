import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import React from "react";
import { Link } from 'react-router-dom';
const HomeCat = (props) =>{
    

    return (
        
        <section className="homeCat">
            <div className="container sidebarNav">
                <h3 className="mb-3 hd">CATEGORY</h3>
            <Swiper 
                    slidesPerView ={10}
                    spaceBetween = {10}
                    navigation= {true}
                    slidesPerGroup={3}
                    modules={[Navigation]}
                    className="mySwiper"
                    >
                        {
                            
                            props.catData?.categoryList?.length!==0 && props.catData?.categoryList?.map((cat, index)=>{
                                return(
                                <SwiperSlide key={index}>
                                    <Link to={`/cat/${cat.id}`}>
                                    <div className="item text-center cursor" style={{background: cat.color}}>
                                        <img src={cat.images[0]} alt=''/>
                                        <h6 >{cat.name}</h6>
                                    </div>
                                    </Link>
                                </SwiperSlide>   
                                
                                )
                            })
                        }
                           
                
            </Swiper>       
            </div>
        </section>
    )
}

export default HomeCat;