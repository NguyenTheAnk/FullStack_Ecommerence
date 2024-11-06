import React, { useContext, useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { IoBagCheckOutline } from "react-icons/io5";
import { MyContext } from "../../App";
import { fetchDataFromAPI, postData } from "../../utils/api";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";
const Checkout=()=>{
    const context = useContext(MyContext);
    const [cartData, setCartData] = useState([]);
    const [totalAmount,setTotalAmount] = useState();
    const [formFields, setFormFields] = useState({
        fullName: "",
        country: "",
        streetAddressLine1: "",
        streetAddressLine2: "",
        city: "",
        state: "",
        zipCode: "",
        phoneNumber: "",
        email: "",
    })
    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem('user'));
       fetchDataFromAPI(`/api/cart?userId=${user?.userId}`).then((res)=>{
        setCartData(res);
    })
       
    },[])
    const onChangeInput=(e)=>{
        setFormFields(()=> ({
           ...formFields,
            [e.target.name]: e.target.value
        }))
    }
    const history = useNavigate();
    const calculateTotalAmount = () => {
        return cartData.length
            ? cartData.map(item => parseInt(item.price) * item.quantity)
                .reduce((total, value) => total + value, 0)
            : 0;
    };
    const checkout=(e)=>{
        e.preventDefault();
        setTotalAmount( cartData?.length
            && cartData?.map(item => parseInt(item.price) * item.quantity)
            .reduce((total, value) => total + value, 0));

        console.log(formFields);
        if(formFields.fullName===""){
            context.setAlertBox({
                open:true,
                error:true,
                msg:'Please fill full name!'
            })
            return false;
        }
        if(formFields.country===""){
            context.setAlertBox({
                open:true,
                error:true,
                msg:'Please fill country!'
            })
            return false;
        }
        if(formFields.streetAddressLine1===""){
            context.setAlertBox({
                open:true,
                error:true,
                msg:'Please fill street address line 1!'
            })
            return false;
        }
        if(formFields.streetAddressLine2===""){
            context.setAlertBox({
                open:true,
                error:true,
                msg:'Please fill street address line 2!'
            })
            return false;
        }
        if(formFields.city===""){
            context.setAlertBox({
                open:true,
                error:true,
                msg:'Please fill city!'
            })
            return false;
        }
        if(formFields.state===""){
            context.setAlertBox({
                open:true,
                error:true,
                msg:'Please fill state!'
            })
            return false;
        }
        if(formFields.zipCode===""){
            context.setAlertBox({
                open:true,
                error:true,
                msg:'Please fill zip code!'
            })
            return false;
        }
        if(formFields.phoneNumber===""){
            context.setAlertBox({
                open:true,
                error:true,
                msg:'Please fill phone number!'
            })
            return false;
        }
        if(formFields.email===""){
            context.setAlertBox({
                open:true,
                error:true,
                msg:'Please fill email!'
            })
            return false;
        }

        const addressInfo={
            name: formFields.fullName,
            phoneNumber: formFields.phoneNumber,
            address: formFields.streetAddressLine1 + formFields.streetAddressLine2,
            pincode: formFields.zipCode,
            date: new Date().toLocaleString(
                "en-US",
                {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                }
            )
        }

    var options ={
        key: process.env.REACT_APP_PAYPAL_KEY_ID,
        key_secret: process.env.REACT_APP_PAYPAL_KEY_SECRET,
        amount: parseInt(totalAmount),
        currency: "INR",
        order_receipt: 'order_rcptid_' + formFields.fullName,
        name: "Nguyen The Anh",
        description: "for testing purpose",
        handler: function(response) {
            const paymentId = response.palpal_payment_id;
            const user = JSON.parse(localStorage.getItem('user'));
            const payLoad ={
                data:{
                    name: addressInfo.fullName,
                    phoneNumber: addressInfo.phoneNumber,
                    address: addressInfo.streetAddressLine1 + addressInfo.streetAddressLine2,
                    pincode: addressInfo.zipCode,
                    amount: parseInt(totalAmount),
                    email: user?.email,
                    userId: user?.userId,
                    products: cartData,
                    paymentId: paymentId,
                    date: new Date().toLocaleString(
                        "en-US",
                        {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                        }
                    )
                }
            }
            postData(`/api/orders/create`, payLoad).then((res)=>{
               history("/orders");
            })
        },
        theme:{
            color: "#3399cc"
        }
    };
    var pay = new window.Paypal(options);
    pay.open();
   
    }
    const handlePayPalApprove = (data, actions) => {
        return actions.order.capture().then(details => {
            const user = JSON.parse(localStorage.getItem('user'));
            const payLoad = {
                data: {
                    name: formFields.fullName,
                    phoneNumber: formFields.phoneNumber,
                    address: formFields.streetAddressLine1 + formFields.streetAddressLine2,
                    pincode: formFields.zipCode,
                    amount: parseInt(totalAmount),
                    email: user?.email,
                    userId: user?.userId,
                    products: cartData,
                    paymentId: details.id,
                    date: new Date().toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    })
                }
            };
            postData(`/api/orders`, payLoad).then((res) => {
                // Add routing or success message here
                console.log("Order successful", res);
            });
        });
    };
    return(
        <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID }}>
        <section className="section">
            <div className="container">
                <form className="checkoutForm" onSubmit={checkout}>
                    <div className="row">
                        <div className="col-md-8">
                            <h2 className="hd">BILLING DETAILS </h2>
                           
                            <div className="row mt-3">
                                <div className="col-md-6">
                                <h6> Full name *</h6>
                                    <div className="form-group">
                                        <TextField label="Full name *" variant="outlined" className="w-100" name="fullName" onChange={onChangeInput} error={formFields.fullName==="" ? true : false}/>
                                    </div>
                                </div>
                                
                                <div className="col-md-6">
                                <h6> Country *</h6>
                                    <div className="form-group">
                                        <TextField label="Country" variant="outlined" className="w-100" name="country" onChange={onChangeInput}/>                                  
                                    </div>
                                </div>
                            </div>
                            <h6> Street address *</h6>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <TextField label="House number and street name " variant="outlined" className="w-100" name="streetAddressLine1" onChange={onChangeInput}/>
                                    </div>
                                    <div className="form-group">
                                        <TextField label="Apartment, suite, unit, etc.(optional)" variant="outlined" className="w-100" name="streetAddressLine2" onChange={onChangeInput}/>
                                    </div>
                                </div>
                            </div>

                            <h6> Town/ City *</h6>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <TextField label="Town/ City " variant="outlined" className="w-100" name="city" onChange={onChangeInput}/>
                                    </div>
                                </div>
                            </div>

                            <h6> State/ Country *</h6>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <TextField label="State " variant="outlined" className="w-100" name="state" onChange={onChangeInput}/>
                                    </div>
                                </div>
                            </div>

                            <h6> Postcode/ ZIP *</h6>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <TextField label="ZIP code" variant="outlined" className="w-100" name="zipCode" onChange={onChangeInput}/>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="row">
                                <div className="col-md-6">
                                    <h6> Phone *</h6>
                                    <div className="form-group">
                                        <TextField label="Phone number" variant="outlined" className="w-100" name="phoneNumber" onChange={onChangeInput}/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <h6> Email address *</h6>
                                    <div className="form-group">
                                        <TextField label="Email " variant="outlined" className="w-100" name="email" onChange={onChangeInput}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className='card orderInfo'>
                                <h2 className="hd">YOUR ORDER</h2>
                                <div className='table-responsive mt-3'>
                                    <table className='table table-borderless'>
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                cartData?.length!==0 && cartData?.map((item, index)=>{
                                                    return(
                                                        <tr>
                                                            <td>
                                                                {item?.productTitle?.substr(0,20)+ '...'} <b> x {item?.quantity}</b>
                                                            </td>
                                                            <td>
                                                                $ {item?.subTotal}
                                                            </td>
                                                    </tr>
                                                    
                                                    )
                                                })
                                            }
                                            <tr>
                                                            <td>
                                                               Subtotal
                                                            </td>
                                                            <td>$ &nbsp;
                                                            {
                                                                cartData?.length
                                                                    ? cartData?.map(item => parseInt(item.price) * item.quantity)
                                                                        .reduce((total, value) => total + value, 0)
                                                                    : '0'
                                                            }
                                                            </td>
                                                    </tr>
                                                                                     
                                        </tbody>
                                    </table>
                                </div>
                                    <PayPalButtons
                                        createOrder={(data, actions) => {
                                            return actions.order.create({
                                                purchase_units: [{
                                                    amount: {
                                                        value: calculateTotalAmount().toString()
                                                    }
                                                }]
                                            });
                                        }}
                                        onApprove={handlePayPalApprove}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </PayPalScriptProvider>
    )
};
export default Checkout;