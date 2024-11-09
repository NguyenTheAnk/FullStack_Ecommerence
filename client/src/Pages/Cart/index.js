import { Link } from "react-router-dom";
import Rating from '@mui/material/Rating';
import QuantityBox from "../../Components/QuantityBox";
import { IoMdClose } from "react-icons/io";
import Button from '@mui/material/Button';
import { MyContext } from "../../App";
import { useContext, useEffect, useState } from "react";
import { deleteData, editData, fetchDataFromAPI } from "../../utils/api";
import { IoBagCheckOutline } from "react-icons/io5";
// import {loadStripe} from '@stripe/stripe-js';
const Cart = () => {
    const [productQuantity, setProductQuantity] = useState();
    const [changeQuantity, setChangeQuantity] = useState(0);
    const context = useContext(MyContext);
    const [cartData, setCartData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedQuantity, setSelectedQuantity] = useState();
    let [cartFields, setCartFields] = useState({});
    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem('user'));
       fetchDataFromAPI(`/api/cart?userId=${user?.userId}`).then((res)=>{
        setCartData(res);
        setSelectedQuantity(res?.quantity);
       })
    },[])
    const quantity=(val)=>{
        setProductQuantity(val);
        setChangeQuantity(val);
    }

    const selectedItem=(item, quantityVal)=>{
        if(changeQuantity!==0){
            setIsLoading(true);
            const user = JSON.parse(localStorage.getItem("user"));
            cartFields.productTitle = item?.productTitle
            cartFields.image= item?.images
            cartFields.rating= item?.rating
            cartFields.price= item?.price
            cartFields.quantity= quantityVal
            cartFields.subTotal= parseInt(item?.price * quantityVal)
            cartFields.productId= item?.id
            cartFields.userId= user?.userId
    
            editData(`/api/cart/${item?._id}`,cartFields).then((res)=>{
                setTimeout(()=>{
                    setIsLoading(false);
                    fetchDataFromAPI(`/api/cart`).then((res)=>{
                        setCartData(res);
                       })
                },500)
            })
        } 
    }
    // const history = useNavigate();
    const removeItem=(id)=>{
        deleteData(`/api/cart/${id}`).then((res)=>{
            context.setAlertBox({
                open: true,
                error: false,
                msg: 'Product removed successfully from cart!'
            })
            fetchDataFromAPI(`/api/cart`).then((res)=>{
                setCartData(res);
               })
               context.getCartData();
        })
    }
    // const checkout = async () => {
    //     const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
    //     const cartProducts = cartData.map((product) => ({
    //         productTitle: product.productTitle,
    //         image: product.image,
    //         price: product.price,
    //         quantity: product.quantity
    //     }));
    //     const userData = JSON.parse(localStorage.getItem("user"));
        
    //     const body = {
    //         products: cartProducts,
    //         userId: userData.userId
    //     };

    //     const response = await fetch(`${process.env.REACT_APP_API_URL}/api/checkout`, {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(body)
    //     });
        
    //     const session = await response.json();
    //     const result = await stripe.redirectToCheckout({ sessionId: session.id });
    //     postData(`/api/orders/create`,session).then((res)=>{
    //         history("/orders");
    //     })
    //     console.log(JSON.stringify(result));

    //     if (result.error) console.log(result.error.message);

    // };
    return (
        <>
        
        <section className="section cartPage">
            <div className="container">
            <h2 className="hd mb-0">Your Cart</h2>
            <p>There are <b className="text-red">{cartData?.length}</b> products in your cart</p>
               <div className="row">
                <div className="col-md-9 pr-4">
                      


                        <div className="table-responsive">
                            <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Unit Price</th>
                                            <th>Quantity</th>
                                            <th>Subtotal</th>
                                            <th>Remove</th>
                                        </tr>
                                    </thead>
                            
                            <tbody>
                                {
                                    cartData?.length!==0 && cartData?.map((item,index)=>{
                                        return(
                                            <tr>
                                            <td>
                                                <Link to={`/product/${item?.productId}`}>
                                                    <div className="d-flex align-items-center cartItemimgWrapper">
                                                        <div className="imgWrapper">
                                                            <img src={item?.image} className= "w-100" alt={item?.productTitle}/>
                                                        </div>
        
                                                        <div className="info px-3">
                                                            <h6>{item?.productTitle?.substr(0,30)+ '...'}</h6>
                                                            <Rating name="read-only" value={parseInt(item?.rating)} size="small" readOnly /> 
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td>
                                                $ &nbsp;{item?.price}
                                            </td>
                                            <td>
                                                <QuantityBox quantity={quantity} item={item} selectedItem={selectedItem} value={item?.quantity}/>
                                            </td>
                                            <td>
                                               $ &nbsp;{item?.subTotal}
                                            </td>
                                            <td> 
                                                <span className="remove" onClick={()=> removeItem(item?._id)}><IoMdClose/></span>
                                            </td>
                                        </tr>                                                                        
                                        )
                                        
                                    })
                                }
                               
                            </tbody>
                            </table>
                        </div>
                </div>
                <div className="col-md-3">
                    <div className="card border p-3 cartDetails">
                        <h4> CART TOTALS</h4>

                        <div className="d-flex align-items-center mb-3">
                            <span>Subtotal</span>
                            <span className="ml-auto text-red font-weight-bold">$ &nbsp;
                            {
                                            cartData?.length
                                                ? cartData?.map(item => parseInt(item.price) * item.quantity)
                                                    .reduce((total, value) => total + value, 0)
                                                : '0'
                                        }
                            </span>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                            <span>Shipping</span>
                            <span className="ml-auto"><b>Free</b></span>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                            <span>Estimate for</span>
                            <span className="ml-auto"><b>United Kingdom</b></span>
                        </div>
                        <div className="d-flex align-items-center mb-3">
                            <span>Total</span>
                            <span className="ml-auto text-red font-weight-bold">$ &nbsp;
                            {
                                            cartData?.length
                                                ? cartData?.map(item => parseInt(item.price) * item.quantity)
                                                    .reduce((total, value) => total + value, 0)
                                                : '0'
                                        }
                            </span>
                        </div>
                        <br/>
                        <Link to="/checkout">
                            <Button className='btn-blue bg-red btn-lg btn-big ml-4'><IoBagCheckOutline/> &nbsp; Check out</Button>
                        </Link>
                    </div>
                </div>
               </div>
            </div>
        </section>
       {
        isLoading===true &&  <div className="loading"></div>
       }
        </>
    )
}
export default Cart;
