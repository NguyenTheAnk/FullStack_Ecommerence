import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation , Autoplay } from 'swiper/modules';
import slide1  from '../../assets/images/slideBanner1.jpg'
import slide2  from '../../assets/images/slideBanner2.jpg'
import slide3  from '../../assets/images/slideBanner3.jpg'



const HomeBanner =(props) => {

    return (
        <div className="container mt-3">
            <div className="homeBannerSection">
            
                <Swiper
                    
                    slidesPerView={1}
                    spaceBetween={15}
                    navigation={true}
                    loop={false}
                    autoplay={{
                        delay:2500,
                        disableOnInteraction:false,
                    }}
                    modules={[Navigation, Autoplay]}
                    className="mySwiper"
                >
                    {
                        props?.data?.length!==0 && props?.data?.map((item, index)=>{
                            return(
                                <SwiperSlide key={index}>
                                    <div className="item">
                                        <img src={item?.images[0]} className="w-100 " alt="" />
                                    </div>
                                </SwiperSlide>
                            )
                        })
                    }
                   
                    

                </Swiper>
            </div>
        </div>
    )
}

export default HomeBanner;