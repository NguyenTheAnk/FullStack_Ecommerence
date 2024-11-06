import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import { IoMdClose } from "react-icons/io";
import Rating from '@mui/material/Rating';
import { useContext, useEffect, useState} from 'react';
import QuantityBox from '../QuantityBox';
import { MdOutlineCompareArrows } from "react-icons/md";
import { MyContext } from '../../App';
import ProductZoom from '../ProductZoom';
import { fetchDataFromAPI, postData } from '../../utils/api';
import { BsCartFill } from "react-icons/bs";
import { IoMdHeartEmpty } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
const ProductModal = (props) => {

    
    const context = useContext(MyContext);
    const [productQuantity, setProductQuantity] = useState();
    const [activeSize, setActiveSize] =  useState(null);
    const [tabError,setTabError] = useState(false);
    let [cartFields, setCartFields] = useState({});
    const [changeQuantity, setChangeQuantity] = useState(0);
    const [isAddedToMyList,setIsAddedToMyList] = useState(false);
    const isActive = (index)=> {
        setActiveSize(index);
        setTabError(false);
    }
    const quantity=(val)=>{
        setProductQuantity(val);
        setChangeQuantity(val);
    }
    const addtoCart=()=>{
        if(activeSize!==null){
            const user = JSON.parse(localStorage.getItem("user"));
            cartFields.productTitle = props?.data?.name
            cartFields.image=  props?.data?.images[0]
            cartFields.rating=  props?.data?.rating
            cartFields.price=  props?.data?.price
            cartFields.quantity= productQuantity
            cartFields.subTotal= parseInt( props?.data?.price * productQuantity)
            cartFields.productId=  props?.data?.id
            cartFields.userId= user?.userId
            context.addToCart(cartFields);
            
        }else{
           setTabError(true);
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
                productTitle: props?.data?.name,
                image: props?.data?.images[0],
                rating: props?.data?.rating,
                price: props?.data?.price,
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
    
     useEffect(()=>{
        if(props?.data?.productRAMS.length === 0 && props?.data?.productWeight.length === 0 && props?.data?.productSize.length===0){
            setActiveSize(1);
        }
        const user = JSON.parse(localStorage.getItem("user"));
        fetchDataFromAPI(`/api/my-list?productId=${props?.data?.id}&userId=${user?.userId}`).then((res)=>{
            if(res.length!==0){
                setIsAddedToMyList(true);
            }
        })
   
     },[]);  
    return (
        <>
            <Dialog open={context.isOpenProductModal} className="productModal" onClose={() => context.setisOpenProductModal(false)}>
                <Button className='close_' onClick={() => context.setisOpenProductModal(false)}><IoMdClose /></Button>
                <h4 className="mb-1 font-weight-bold pr-5">{props?.data?.name}</h4>
                <div className='d-flex align-items-center'>
                    <div className='d-flex align-items-center mr-4'>
                        <span>Thương hiệu: </span>
                        <span className='ml-2'><b>{props?.data?.brand}</b> </span>
                    </div>
                    <Rating name="read-only" value={parseInt(props?.data?.rating)} size="small" precision={0.5} readOnly />
                </div>
                <hr />
                <div className='row mt-2 productDetailModel'>
                    <div className='col-md-5'>                      
                    <ProductZoom images={props?.data?.images} discount={props?.data?.discount}/>
                    </div>
                    <div className='col-md-7'>
                        <div className='d-flex info align-items-center mb-3'>
                            <span className='oldPrice lg mr-2'>Rs: {props?.data?.oldPrice}</span>
                            <span className='netPrice text-danger lg'>Rs: {props?.data?.price}</span>
                        </div>
                        <span className='badge bg-success'>IN STOCK</span>
                        <p className='mt-3'>{props?.data?.description}</p>
                        {
                                props?.data?.productSize?.length !== 0 &&
                                <div className="productSize d-flex align-items-center">
                                    <span>Size:</span>
                                       
                                        <ul className={`list list-inline mb-0 pl-4 ${tabError===true && 'error'}`}>
                                           {
                                             props?.data?.productSize?.map((item, index)=>{
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
                                props?.data?.productRAMS?.length !== 0 &&
                                <div className="productSize d-flex align-items-center">
                                    <span>Rams:</span>
                                       
                                        <ul className="list list-inline mb-0 pl-4">
                                           {
                                             props?.data?.productRAMS?.map((item, index)=>{
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
                                props?.data?.productWeight?.length !== 0 &&
                                <div className="productSize d-flex align-items-center">
                                    <span>Weight:</span>
                                       
                                        <ul className="list list-inline mb-0 pl-4">
                                           {
                                             props?.data?.productWeight?.map((item, index)=>{
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
                        <div className='d-flex align-items-center'>
                            <QuantityBox quantity={quantity} item={props?.data}/>
                            <Button className="btn-blue btn-lg btn-big btn-round" onClick={()=> addtoCart()}><BsCartFill/> &nbsp;
                                    {
                                        context.addingInCart===true ? "Adding..." : "Add to cart"
                                    }
                            </Button>
                        </div>

                        <div className='d-flex align-items-center mt-5 actions'>
                            <Button onClick={()=> addToMyList(props?.data?.id)}>
                                {
                                    isAddedToMyList===true ? 
                                    <>
                                        <FaHeart className='text-danger' style={{fontSize: '20px'}}/> &nbsp; ADDED TO WISHLIST
                                    </>
                                    :
                                    <>
                                        <IoMdHeartEmpty style={{fontSize: '20px'}}/> &nbsp; ADD TO WISHLIST
                                    </>
                                }
                                
                            </Button>
                            <Button className='btn-round btn-sml ml-3' variant="outlined"> <MdOutlineCompareArrows /> &nbsp; COMPARE</Button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default ProductModal;
