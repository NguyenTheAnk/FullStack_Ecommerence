import { Chip, emphasize, styled } from "@mui/material";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useRef } from "react";
import Slider from "react-slick";
import { MdBrandingWatermark } from "react-icons/md";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { MdFilterVintage } from "react-icons/md";
import { IoIosColorPalette } from "react-icons/io";
import { SiZerodha } from "react-icons/si";
import { IoIosPricetags } from "react-icons/io";
import { IoMdCart } from "react-icons/io";
import { GiStarsStack } from "react-icons/gi";
import { FaCheckCircle } from "react-icons/fa";
import LinearProgress from '@mui/material/LinearProgress';
import UserAvatarImgComponent from "../../components/userAvatarImg";
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import { FaReply } from "react-icons/fa";
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

    const productSliderBig = useRef();
    const productSliderSml = useRef();

    var productSliderOptions = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false
      };
      var productSliderSmlOptions = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false
      };

      const goToSlide= (index) =>{
        productSliderBig.current.slickGoTo(index);
        productSliderSml.current.slickGoTo(index);
      };
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
                            <Slider {...productSliderOptions} ref={productSliderBig} className="sliderBig mb-2">
                                <div className="item">
                                    <img src="https://mironcoder-hotash.netlify.app/images/product/single/01.webp" alt="" className="w-100"/>
                                </div>
                                <div className="item">
                                    <img src="https://mironcoder-hotash.netlify.app/images/product/single/01.webp" alt="" className="w-100"/>
                                </div>
                                <div className="item">
                                    <img src="https://mironcoder-hotash.netlify.app/images/product/single/01.webp" alt="" className="w-100"/>
                                </div>
                                <div className="item">
                                    <img src="https://mironcoder-hotash.netlify.app/images/product/single/01.webp" alt="" className="w-100"/>
                                </div>
                                <div className="item">
                                    <img src="https://mironcoder-hotash.netlify.app/images/product/single/01.webp" alt="" className="w-100"/>
                                </div>
                                <div className="item">
                                    <img src="https://mironcoder-hotash.netlify.app/images/product/single/01.webp" alt="" className="w-100"/>
                                </div>
                                <div className="item">
                                    <img src="https://mironcoder-hotash.netlify.app/images/product/single/01.webp" alt="" className="w-100"/>
                                </div>
                            </Slider>
                            <Slider {...productSliderSmlOptions} ref={productSliderSml} className="sliderSml">
                                <div className="item" onClick={()=> goToSlide(1)}>
                                    <img src="https://mironcoder-hotash.netlify.app/images/product/single/02.webp" alt="" className="w-100"/>
                                </div>
                                <div className="item" onClick={()=> goToSlide(2)}>
                                    <img src="https://mironcoder-hotash.netlify.app/images/product/single/05.webp" alt="" className="w-100"/>
                                </div>
                                <div className="item" onClick={()=> goToSlide(3)}>
                                    <img src="https://mironcoder-hotash.netlify.app/images/product/single/03.webp" alt="" className="w-100"/>
                                </div>
                                <div className="item" onClick={()=> goToSlide(4)}>
                                    <img src="https://mironcoder-hotash.netlify.app/images/product/single/04.webp" alt="" className="w-100"/>
                                </div>
                                <div className="item" onClick={()=> goToSlide(5)}>
                                    <img src="https://mironcoder-hotash.netlify.app/images/product/single/03.webp" alt="" className="w-100"/>
                                </div>
                                <div className="item" onClick={()=> goToSlide(6)}>
                                    <img src="https://mironcoder-hotash.netlify.app/images/product/single/04.webp" alt="" className="w-100"/>
                                </div>
                                
                            </Slider>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <div className="pt-3 pb-3 pl-4 pr-4">
                            <h6 className="mb-4">Product Details</h6>

                            <h4>Formal suits for men wedding slim fit 3 piece dress business party jacket</h4>

                            <div className="productInfo mt-4">
                                <div className="row mb-2">
                                    <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><MdBrandingWatermark/></span>
                                           <span className="name">Brand </span>
                                    </div>
                                    <div className="col-sm-9">
                                        :<span>Ecstasy</span>
                                    </div>
                                    <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><BiSolidCategoryAlt/></span>
                                            <span className="name">Category </span>
                                    </div>
                                    <div className="col-sm-9">
                                        :<span>Man's</span>
                                    </div>
                                    <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><MdFilterVintage/></span>
                                            <span className="name">Tags </span>
                                    </div>
                                    <div className="col-sm-9">
                                        :<span>
                                            <ul className="list list-inline tags sml">
                                                <li className="list-inline-item">
                                                    <span>SUITE</span>
                                                </li>
                                                <li className="list-inline-item">
                                                    <span>PARTY</span>
                                                </li>
                                                <li className="list-inline-item">
                                                    <span>DRESS</span>
                                                </li>
                                                <li className="list-inline-item">
                                                    <span>SMART</span>
                                                </li>
                                                <li className="list-inline-item">
                                                    <span>MAN</span>
                                                </li>
                                                <li className="list-inline-item">
                                                    <span>STYLES</span>
                                                </li>
                                            </ul>
                                        </span>
                                    </div>
                                    <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><IoIosColorPalette/></span>
                                            <span className="name">Color </span>
                                    </div>
                                    <div className="col-sm-9">
                                        :<span>
                                        <ul className="list list-inline tags sml">
                                                <li className="list-inline-item">
                                                    <span>RED</span>
                                                </li>
                                                <li className="list-inline-item">
                                                    <span>BLUE</span>
                                                </li>
                                                <li className="list-inline-item">
                                                    <span>WHITE</span>
                                                </li>
                                                <li className="list-inline-item">
                                                    <span>YELLOW</span>
                                                </li>
                                                <li className="list-inline-item">
                                                    <span>BLACK</span>
                                                </li>
                                                
                                            </ul>
                                        </span>
                                    </div>
                                    <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><SiZerodha /></span>
                                            <span className="name">Size </span>
                                    </div>
                                    <div className="col-sm-9">
                                        :<span>
                                        <ul className="list list-inline tags sml">
                                                <li className="list-inline-item">
                                                    <span>S</span>
                                                </li>
                                                <li className="list-inline-item">
                                                    <span>M</span>
                                                </li>
                                                <li className="list-inline-item">
                                                    <span>L</span>
                                                </li>
                                                <li className="list-inline-item">
                                                    <span>XL</span>
                                                </li>
                                                <li className="list-inline-item">
                                                    <span>XXL</span>
                                                </li>
                                                
                                            </ul>
                                        </span>
                                    </div>
                                    <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><IoIosPricetags/></span>
                                            <span className="name">Price </span>
                                    </div>
                                    <div className="col-sm-9">
                                        :<span>Ecstasy</span>
                                    </div>
                                    <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><IoMdCart /></span>
                                            <span className="name">Stock </span>
                                    </div>
                                    <div className="col-sm-9">
                                        :<span>(68) Piece</span>
                                    </div>
                                    <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><GiStarsStack/></span>
                                            <span className="name">Review </span>
                                    </div>
                                    <div className="col-sm-9">
                                        :<span>(03) Reviews</span>
                                    </div>
                                    <div className="col-sm-3 d-flex align-items-center">
                                            <span className="icon"><FaCheckCircle /></span>
                                            <span className="name">Published </span>
                                    </div>
                                    <div className="col-sm-9">
                                        :<span>02 Feb 2024</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                        
                    </div>
                </div>

                <div className="p-4">
                    <h6 className="mt-4 mb-3"> Product Description</h6>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Molestiae reprehenderit repellendus expedita esse cupiditate quos doloremque rerum, corrupti ab
                    illum est nihil, voluptate ex dignissimos! Sit voluptatem delectus nam, molestiae, repellendus ab sint quo aliquam debitis amet natus doloremque laudantium? Repudiandae, consequuntur, officiis quidem quo deleniti, autem non laudantium sequi error molestiae ducimus accusamus facere velit consectetur vero dolore natus nihil temporibus aspernatur quia consequatur? Consequuntur voluptate deserunt repellat tenetur debitis molestiae doloribus dicta. 
                    In rem illum dolorem atque ratione voluptates asperiores maxime doloremque laudantium magni neque ad 
                    quae quos quidem, quaerat rerum ducimus blanditiis reiciendis</p>


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
                    <h6 className="mt-4 mb-4"> Customer Reviews </h6>
                    <div className="reviewsSection">
                        <div className="reviewsRow">
                            <div className="row">
                                <div className="col-sm-7 d-flex">
                                    <div className="d-flex  flex-column">
                                        <div className="userInfo d-flex align-items-center mb-3">
                                                <UserAvatarImgComponent img="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" lg={true}/>
                                                    <div className="info pl-3">
                                                        <h6>Nguyen The Anh</h6>
                                                        <span>25 minutes ado!</span>
                                                    </div>
                                                </div>
                                                <Rating name="read-only" value={4.5} precision={0.5} readOnly size="small"/>
                                        </div>
                                  
                                    
                                </div>
                                <div className="col-md-5 d-flex align-items-center">
                                    <div className="ml-auto">
                                        <Button className="btn-blue btn-big btn-lg ml-auto"> <FaReply/> &nbsp; Reply</Button>
                                    </div>
                                </div>
                                
                                
                                <p className="mt-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                                        Omnis quo nostrum dolore fugiat ducimus labore debitis unde autem recusandae? 
                                        Eius harum tempora quis minima, adipisci natus quod magni omnis quas.</p>

                                
                            </div>
                        </div>
                        <div className="reviewsRow reply">
                            <div className="row">
                                <div className="col-sm-7 d-flex">
                                    <div className="d-flex  flex-column">
                                        <div className="userInfo d-flex align-items-center mb-3">
                                                <UserAvatarImgComponent img="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" lg={true}/>
                                                    <div className="info pl-3">
                                                        <h6>Nguyen The Anh</h6>
                                                        <span>25 minutes ado!</span>
                                                    </div>
                                                </div>
                                    <Rating name="read-only" value={4.5} precision={0.5} readOnly size="small"/>
                                        </div>
                                  
                                    
                                </div>
                                <div className="col-md-5 d-flex align-items-center">
                                    <div className="ml-auto">
                                        <Button className="btn-blue btn-big btn-lg ml-auto"> <FaReply/> &nbsp; Reply</Button>
                                    </div>
                                </div>
                                
                                
                                <p className="mt-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                                        Omnis quo nostrum dolore fugiat ducimus labore debitis unde autem recusandae? 
                                        Eius harum tempora quis minima, adipisci natus quod magni omnis quas.</p>

                                
                            </div>
                        </div>
                        <div className="reviewsRow reply">
                            <div className="row">
                                <div className="col-sm-7 d-flex">
                                    <div className="d-flex  flex-column">
                                        <div className="userInfo d-flex align-items-center mb-3">
                                                <UserAvatarImgComponent img="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" lg={true}/>
                                                    <div className="info pl-3">
                                                        <h6>Nguyen The Anh</h6>
                                                        <span>25 minutes ado!</span>
                                                    </div>
                                                </div>
                                    <Rating name="read-only" value={4.5} precision={0.5} readOnly size="small"/>
                                        </div>
                                  
                                    
                                </div>
                                <div className="col-md-5 d-flex align-items-center">
                                    <div className="ml-auto">
                                        <Button className="btn-blue btn-big btn-lg ml-auto"> <FaReply/> &nbsp; Reply</Button>
                                    </div>
                                </div>
                                
                                
                                <p className="mt-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                                        Omnis quo nostrum dolore fugiat ducimus labore debitis unde autem recusandae? 
                                        Eius harum tempora quis minima, adipisci natus quod magni omnis quas.</p>

                                
                            </div>
                        </div>
                        <div className="reviewsRow">
                            <div className="row">
                                <div className="col-sm-7 d-flex">
                                    <div className="d-flex  flex-column">
                                        <div className="userInfo d-flex align-items-center mb-3">
                                                <UserAvatarImgComponent img="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" lg={true}/>
                                                    <div className="info pl-3">
                                                        <h6>Nguyen The Anh</h6>
                                                        <span>25 minutes ado!</span>
                                                    </div>
                                                </div>
                                    <Rating name="read-only" value={4.5} precision={0.5} readOnly size="small"/>
                                        </div>
                                  
                                    
                                </div>
                                <div className="col-md-5 d-flex align-items-center">
                                    <div className="ml-auto">
                                        <Button className="btn-blue btn-big btn-lg ml-auto"> <FaReply/> &nbsp; Reply</Button>
                                    </div>
                                </div>
                                
                                
                                <p className="mt-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                                        Omnis quo nostrum dolore fugiat ducimus labore debitis unde autem recusandae? 
                                        Eius harum tempora quis minima, adipisci natus quod magni omnis quas.</p>

                                
                            </div>
                        </div>


                        <br/>
                        <h6 className="mt-4 mb-4">Review Reply Form</h6>
                        <form className="reviewForm"> 
                            <textarea placeholder="Write here">
                            </textarea>

                            <Button className="btn-blue btn-big btn-lg w-100 mt-4">Drop your replies</Button>
                        </form>
                    </div>
                </div>
                
            </div>
        </div>

        
        </>
    )
}

export default ProductDetails;