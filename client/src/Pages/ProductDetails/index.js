import ProductZoom from "../../Components/ProductZoom";
import Rating from '@mui/material/Rating';
import QuantityBox from "../../Components/QuantityBox";
import  Button from '@mui/material/Button';
import { BsCartFill } from "react-icons/bs";
import { useContext, useState } from "react";
import { IoMdHeartEmpty } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { MdOutlineCompareArrows } from "react-icons/md";
import Tooltip from '@mui/material/Tooltip';
import RelatedProducts from "./RelatedProducts";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchDataFromAPI, postData} from "../../utils/api";
import { MyContext } from "../../App";
import CircularProgress from '@mui/material/CircularProgress';
const ProductDetails = (props) => {

    const [activeSize, setActiveSize] =  useState(null);
    const [activeTabs, setActiveTabs] = useState(0);
    const [productData, setProductData] = useState();
    const [productQuantity, setProductQuantity] = useState();
    const [tabError,setTabError] = useState(false);
    const context = useContext(MyContext);
    const [relatedProductData, setRelatedProductData] = useState([]);
    const [isLoading,setIsLoading] = useState(false);
    const [recentlyViewdProducts, setRecentlyViewdProducts] = useState([]);
    const [isAddedToMyList,setIsAddedToMyList] = useState(false);
    const [changeQuantity, setChangeQuantity] = useState(0);
    let {id} = useParams();
    const [reviewsData,setReviewsData] = useState([]);
    let [cartFields, setCartFields] = useState({});
    const isActive = (index)=> {
        setActiveSize(index);
        setTabError(false);
    }
    useEffect(()=>{
        window.scroll(0,0);
        setActiveSize(null);
        fetchDataFromAPI(`/api/products/${id}`).then((res)=>{
            setProductData(res);           
            fetchDataFromAPI(`/api/products?subCatId=${res?.subCatId}`).then((res)=>{
                const filteredData = res?.productList?.filter(item=>item.id !==id);
                setRelatedProductData(filteredData);
            })
                // fetchDataFromAPI(`/api/products/recentlyViewd`).then((response)=>{
                //         setRecentlyViewdProducts(response);
                // })
                // postData(`/api/products/recentlyViewd`,res);
            
        })
        if(productData?.productRAMS===undefined &&productData?.productWeight===undefined && productData?.productSize===undefined){
            setActiveSize(1);
        }
        fetchDataFromAPI(`/api/productReviews?productId=${id}`).then((res)=>{
            setReviewsData(res);
        })

        const user = JSON.parse(localStorage.getItem("user"));
        fetchDataFromAPI(`/api/my-list?productId=${id}&userId=${user?.userId}`).then((res)=>{
            if(res.length!==0){
                setIsAddedToMyList(true);
            }
        })
        
    },[id])
    const quantity=(val)=>{
        setProductQuantity(val);
        setChangeQuantity(val);
    }
   
    const addtoCart=()=>{
        if(activeSize!==null){
            const user = JSON.parse(localStorage.getItem("user"));
            cartFields.productTitle = productData?.name
            cartFields.image= productData?.images[0]
            cartFields.rating= productData?.rating
            cartFields.price= productData?.price
            cartFields.quantity= productQuantity
            cartFields.subTotal= parseInt(productData?.price * productQuantity)
            cartFields.productId= productData?.id
            cartFields.userId= user?.userId
            context.addToCart(cartFields);
            
        }else{
           setTabError(true);
        }
        
    }
    const selectedItem=()=>{
        // if(changeQuantity!==0){
        //     setIsLoading(true);
        //     const user = JSON.parse(localStorage.getItem("user"));
        //     cartFields.productTitle = item?.productTitle
        //     cartFields.image= item?.images
        //     cartFields.rating= item?.rating
        //     cartFields.price= item?.price
        //     cartFields.quantity= quantityVal
        //     cartFields.subTotal= parseInt(item?.price * quantityVal)
        //     cartFields.productId= item?.id
        //     cartFields.userId= user?.userId
    
        //     editData(`/api/cart/${item?._id}`,cartFields).then((res)=>{
        //         setTimeout(()=>{
        //             setIsLoading(false);
        //             fetchDataFromAPI(`/api/cart`).then((res)=>{
        //                 setCartData(res);
        //                })
        //         },500)
        //     })
        // } 
    }
   
    const [rating, setRating] = useState(1);
    const [reviews, setReviews] = useState({
        productId:"",
        customerName:"",
        customerId:"",
        review:"",
        customerRating: 0
    });

    const onChangeInput=(e)=>{
        setReviews(()=>({
            ...reviews,
            [e.target.name]: e.target.value
        }))
    }

    const changeRating=(e)=>{
        setRating(e.target.value);
        reviews.customerRating = e.target.value
    }
    const addReview=(e)=>{
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem("user"));
        reviews.customerName = user?.name;
        reviews.customerId = user?.userId;
        reviews.productId = id;
        setIsLoading(true);
        postData(`/api/productReviews/add`, reviews).then((res)=>{
            setIsLoading(false);
            reviews.customerRating=1;
            setReviews({
                review: "",
                customerRating: 1
            })
            fetchDataFromAPI(`/api/productReviews?productId=${id}`).then((res)=>{
                setReviewsData(res);
            })
        })
    }
    // const gotoReviews=()=>{
    //     window.scrollTo({
    //         top: 550,
    //         behavior: "smooth",
    //     })
    //     setActiveTabs(2);
    // }
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
                productTitle: productData?.name,
                image: productData?.images[0],
                rating: productData?.rating,
                price: productData?.price,
                productId: id,
                userId: user?.userId
            }
                postData(`/api/my-list/add`,data).then((res)=>{
                    if(res.status!==401){
                        setIsAddedToMyList(true);
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
            <section className="productDetails section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 pl-5">
                            <ProductZoom images={productData?.images} discount={productData?.discount}/>
                        </div>
                        <div className="col-md-7 pl-5 pr-5">
                        <h2 className="hd text-capitalize">{productData?.name}</h2>

                        <ul className="list list-inline d-flex align-items-center">
                            <li className="list-inline-item">
                                <div className="d-flex align-items-center">
                                    <span className="text-light mr-2">Brand: </span>
                                    <span>{productData?.brand}</span>
                                </div>
                            </li>

                            <li className="list-inline-item">
                               <div className="d-flex align-items-center">
                               <Rating name="read-only" value={parseInt(productData?.rating)} size="small" precision={0.5} readOnly />
                                    <span className="text-light cursor ml-2">1 Review</span>
                               </div>
                            </li>

                           
                        </ul>

                        <div className="d-flex info mb-3">
                            <span className="oldPrice">Rs: {productData?.oldPrice}</span>
                            <span className="netPrice text-danger ml-2">Rs: {productData?.price}</span>
                        </div>

                            <span className="badge badge-success">
                                IN STOCK
                            </span>
                            <p className="mt-3">{productData?.description}</p>
                            {
                                productData?.productSize?.length !== 0 &&
                                <div className="productSize d-flex align-items-center">
                                    <span>Size:</span>
                                       
                                        <ul className={`list list-inline mb-0 pl-4 ${tabError===true && 'error'}`}>
                                           {
                                             productData?.productSize?.map((item, index)=>{
                                                return(
                                                    <li className="list-inline-item">
                                                    <a className={`tag ${activeSize === index ? 'active' : ''}`} onClick={() => isActive(index)}>{item}</a> 
                                                </li>
                                                )
                                            })
                                           }

                                                                                           
                                        </ul>
                                   </div>
                            }
                            {
                                productData?.productRAMS?.length !== 0 &&
                                <div className="productSize d-flex align-items-center">
                                    <span>Rams:</span>
                                       
                                        <ul className="list list-inline mb-0 pl-4">
                                           {
                                             productData?.productRAMS?.map((item, index)=>{
                                                return(
                                                    <li className="list-inline-item">
                                                    <a className={`tag ${activeSize === index ? 'active' : ''}`} onClick={() => isActive(index)}>{item}</a> 
                                                </li>
                                                )
                                            })
                                           }

                                                                                           
                                        </ul>
                                   </div>
                            }
                            {
                                productData?.productWeight?.length !== 0 &&
                                <div className="productSize d-flex align-items-center">
                                    <span>Weight:</span>
                                       
                                        <ul className="list list-inline mb-0 pl-4">
                                           {
                                             productData?.productWeight?.map((item, index)=>{
                                                return(
                                                    <li className="list-inline-item">
                                                    <a className={`tag ${activeSize === index ? 'active' : ''}`} onClick={() => isActive(index)}>{item}</a> 
                                                </li>
                                                )
                                            })
                                           }

                                                                                           
                                        </ul>
                                   </div>
                            }
                               
                                <div className="d-flex align-items-center mt-3">
                                    <QuantityBox quantity={quantity} selectedItem={selectedItem}/>
                                    <Button className="btn-blue btn-lg btn-big btn-round" onClick={()=> addtoCart()}><BsCartFill/> &nbsp;
                                    {
                                        context.addingInCart===true ? "Adding..." : "Add to cart"
                                    }
                                    </Button>
                                    <Tooltip title={` ${isAddedToMyList===true ? 'Added to Wishlist' : 'Add to Wishlist'} `} placement="top">
                                        <Button className={`btn-blue btn-lg btn-big btn-circle ml-4`} onClick={()=> addToMyList(id)}>
                                        {
                                            isAddedToMyList===true ? 
                                            <>
                                                <FaHeart className='text-danger' style={{fontSize: '20px'}}/> &nbsp;
                                            </>
                                            :
                                            <>
                                                <IoMdHeartEmpty style={{fontSize: '20px'}}/> &nbsp;
                                            </>
                                        }
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="Add to Compare" placement="top">
                                        <Button className="btn-blue btn-lg btn-big btn-circle ml-2"><MdOutlineCompareArrows/></Button>
                                    </Tooltip>
                                </div>
                        </div>
                    </div>

                    <br/>
                    
                    <div className="card mt-5 p-5 detailsPageTabs">
                        <div className="customTabs">
                            <ul className="list list-inline">
                                <li className="list-inline-item">
                                    <Button className={`${activeTabs===0 && 'active'}`}
                                    onClick={() => {
                                        setActiveTabs(0)
                                    }}
                                    >Description</Button>
                                </li>
                                <li className="list-inline-item">
                                    <Button className={`${activeTabs===1 && 'active'}`}
                                    onClick={() => {
                                        setActiveTabs(1)
                                    }}
                                    >Additional Info</Button>
                                </li>
                                <li className="list-inline-item">
                                    <Button className={`${activeTabs===2 && 'active'}`}
                                    onClick={() => {
                                        setActiveTabs(2)
                                    }}
                                    >Review (3)</Button>
                                </li>
                            </ul>

                            <br/>

                            {
                                activeTabs===0 && 
                                <div className="tabContent">
                                   <div className="tabContent">
                                   {productData?.description}

                                   </div>
                                </div>                              
                            }

                            {
                                activeTabs===1 &&
                                <div className="tabContent">
                                    <div className="table-responsive">
                                        <table className="table table-bordered">
                                            <tbody>
                                                <tr className="stand-up">
                                                    <th>Stand Up</th>
                                                    <td>
                                                        <p>35"L x 24"W X 37-45"H (front to back wheel)</p>
                                                    </td>
                                                </tr>
                                                <tr className="folded-wo-wheels">
                                                    <th>Folded (w/o wheel)</th>
                                                    <td>
                                                        <p>32.5"L x 18.5"W X 16.5"H </p>
                                                    </td>
                                                </tr>
                                                <tr className="folded-w-wheels">
                                                    <th>Folded (w/o wheel)</th>
                                                    <td>
                                                        <p>32.5"L x 24"W X 18.5"H </p>
                                                    </td>
                                                </tr>
                                                <tr className="door-pass-through">
                                                    <th>Door Pass Through</th>
                                                    <td>
                                                        <p>24</p>
                                                    </td>
                                                </tr>
                                                <tr className="frame">
                                                    <th>Frame</th>
                                                    <td>
                                                        <p>Aluminum</p>
                                                    </td>
                                                </tr>
                                                <tr className="weight-wo-wheels">
                                                    <th>Weight (w/o wheels)</th>
                                                    <td>
                                                        <p>20 LBS</p>
                                                    </td>
                                                </tr>
                                                <tr className="weight-capacity">
                                                    <th>Weight Capacity</th>
                                                    <td>
                                                        <p>60 LBS</p>
                                                    </td>
                                                </tr>
                                                <tr className="width">
                                                    <th>Width</th>
                                                    <td>
                                                        <p>24"</p>
                                                    </td>
                                                </tr>
                                                <tr className="handle-height-ground-to-handle">
                                                    <th>Handle height (ground to handle)</th>
                                                    <td>
                                                        <p>37-45"</p>
                                                    </td>
                                                </tr>
                                                <tr className="wheels">
                                                    <th>Wheels</th>
                                                    <td>
                                                        <p>12" air/ wide track slick tread</p>
                                                    </td>
                                                </tr>
                                                <tr className="seat-back-height">
                                                    <th>Seat back height</th>
                                                    <td>
                                                        <p>21.5"</p>
                                                    </td>
                                                </tr>
                                                <tr className="head-room-inside-canopy">
                                                    <th>Head room (inside canopy)</th>
                                                    <td>
                                                        <p>25"</p>
                                                    </td>
                                                </tr>
                                                <tr className="pa_color">
                                                    <th>Color</th>
                                                    <td>
                                                        <p>Black, Clue, Red, White</p>
                                                    </td>
                                                </tr>
                                                <tr className="pa_size">
                                                    <th>Size</th>
                                                    <td>
                                                        <p>M, S</p>
                                                    </td>
                                                </tr>
                                            </tbody> 
                                        </table>
                                    </div>
                                </div>
                            }


                            {
                                activeTabs ===2 && 
                                <div className="tabContent">
                                    <div className="row">

                                        <div className="col-md-8">
                                            <h3>Customer questions & answers</h3>
                                            <br/>
                                            {
                                                reviewsData?.length!==0 && reviewsData?.slice(0)?.reverse()?.map((item, index)=>{
                                                    return(
                                                        <div className="card p-4 reviewsCard form-group flex-row shadow" key={index}>
                                                        
                                                        <div className="info position-relative">
                                                            <div className="d-flex align-items-center w-100">
                                                                <h5>{item?.customerName}</h5>
                                                                
                                                            </div>
                                                            <h6 className="text-light">{item?.dateCreated}</h6>
                                                            <p>{item?.review}
                                                            </p>
                                                            <div className="rating-position">
                                                                <Rating name="half-rating-read" value={item?.customerRating} precision={0.5} readOnly size="small"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    )
                                                })
                                            }
                                          

                                                
                                        </div>

                                        <br className="res-hide"/>
                                        <br className="res-hide"/>
                                       
                                        
                                        <form className="reviewForm" style={{ marginLeft: '16px', marginTop: '20px' }} onSubmit={addReview}>
                                            <h4> Add a review</h4> <br/>
                                            <div className="form-group">
                                                <textarea className="form-control" placeholder="Write a Review" name="review" value={reviews.review} onChange={onChangeInput}></textarea>
                                            </div>
                                            <div className="row">
                                               
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <Rating name="rating" value={rating} precision={0.5} onChange={changeRating}/>
                                                    </div>
                                                </div>

                                            </div>
                                            <br/>
                                            <div className="form-group">
                                                <Button type="submit" className="btn-blue btn-lg btn-big">
                                                {isLoading===true ? <CircularProgress color="inherit" className="ml-3 loader" /> : 'Submit Review'}
                                                    </Button>
                                            </div>
                                            
                                        </form>
                                        </div>
                                                                          
                                        
                                </div>

                            }
                        </div>
                    </div>

                    <br/>
                    <br/>
                   
                    {
                        relatedProductData?.length !==0 && <RelatedProducts title="RELATED PRODUCTS" data={relatedProductData}/>
                    }
                    
                    <br/>
                    <br/>
                    {
                        recentlyViewdProducts?.length !==0 && <RelatedProducts title="RECENTLY VIEWED PRODUCTS" itemView={"recentlyView"} data={recentlyViewdProducts}/>
                    }
                   
                </div>
            </section>
        </>
    )

}

export default ProductDetails;