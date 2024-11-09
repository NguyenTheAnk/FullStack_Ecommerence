import React, { useContext, useEffect, useRef, useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { IoBagCheckOutline } from "react-icons/io5";
import { MyContext } from "../../App";
import { fetchDataFromAPI, postData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
const Checkout=()=>{
    const context = useContext(MyContext);
    const [cartData, setCartData] = useState([]);
    const [totalAmount,setTotalAmount] = useState();
    const formRef = useRef({  // Sử dụng ref để lưu các trường form
        name: "",
        country: "",
        streetAddressLine1: "",
        streetAddressLine2: "",
        city: "",
        state: "",
        pincode: "",
        phoneNumber: "",
        email: ""
    });
    const [formFields, setFormFields] = useState(formRef.current);
    const user = JSON.parse(localStorage.getItem("user"));
    useEffect(() => {
        if (user?.userId) {
            fetchDataFromAPI(`/api/cart?userId=${user.userId}`)
                .then((res) => {
                    setCartData(res);
                    setTotalAmount(
                        Array.isArray(res) && res.length !== 0
                            ? res.map(item => parseInt(item.price) * item.quantity)
                                .reduce((total, value) => total + value, 0)
                            : 0
                    );
                })
                .catch((error) => {
                    console.error("Failed to fetch cart data", error);
                    setCartData([]);
                    setTotalAmount(0);
                });
        }
    }, [user?.userId]);
    const onChangeInput = (e) => {
        formRef.current = { ...formRef.current, [e.target.name]: e.target.value };
        setFormFields(formRef.current);
    };
    const history = useNavigate();
    const onApprove = (data, actions) => {
        const formValues = formRef.current;  // Lấy giá trị từ ref
        console.log(formValues);  // Sử dụng formValues thay vì formFields
        return actions.order.capture().then((details) => {
            const paymentId = details.id;
            const user = JSON.parse(localStorage.getItem("user"));
            const payLoad = {
                name: formValues.name,
                phoneNumber: formValues.phoneNumber,
                address: formValues.streetAddressLine1 + " " + formValues.streetAddressLine2,
                pincode: formValues.pincode,
                amount: parseInt(totalAmount),
                email: user?.email,
                userId: user?.userId,
                products: cartData,
                paymentId: paymentId,
            };
            postData(`/api/orders/create`, payLoad).then((res) => {
                console.log(payLoad);
                history("/orders");
            });
        });
    };
    
    return(
        <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_CLIENT_ID}}>
        <section className="section">
            <div className="container">
                <form className="checkoutForm" onSubmit={(e) => e.preventDefault()}>
                    <div className="row">
                        <div className="col-md-8">
                            <h2 className="hd">BILLING DETAILS </h2>
                           
                            <div className="row mt-3">
                                <div className="col-md-6">
                                <h6> Full name *</h6>
                                    <div className="form-group">
                                        <TextField label="Full name *" variant="outlined" className="w-100" name="name" value={formFields.name} onChange={onChangeInput}/>
                                    </div>
                                </div>
                                
                                <div className="col-md-6">
                                <h6> Country *</h6>
                                    <div className="form-group">
                                        <TextField label="Country" variant="outlined" className="w-100" name="country"  value={formFields.country} onChange={onChangeInput}/>                                  
                                    </div>
                                </div>
                            </div>
                            <h6> Street address *</h6>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <TextField label="House number and street name " variant="outlined" className="w-100"  value={formFields.streetAddressLine1} name="streetAddressLine1" onChange={onChangeInput}/>
                                    </div>
                                    <div className="form-group">
                                        <TextField label="Apartment, suite, unit, etc.(optional)" variant="outlined" className="w-100"  value={formFields.streetAddressLine2} name="streetAddressLine2" onChange={onChangeInput}/>
                                    </div>
                                </div>
                            </div>

                            <h6> Town/ City *</h6>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <TextField label="Town/ City " variant="outlined" className="w-100" name="city"  value={formFields.city} onChange={onChangeInput}/>
                                    </div>
                                </div>
                            </div>

                            <h6> State/ Country *</h6>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <TextField label="State " variant="outlined" className="w-100" name="state"  value={formFields.state} onChange={onChangeInput}/>
                                    </div>
                                </div>
                            </div>

                            <h6> Postcode/ ZIP *</h6>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <TextField label="ZIP code" variant="outlined" className="w-100" name="pincode"  value={formFields.pincode} onChange={onChangeInput}/>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="row">
                                <div className="col-md-6">
                                    <h6> Phone *</h6>
                                    <div className="form-group">
                                        <TextField label="Phone number" variant="outlined" className="w-100" name="phoneNumber" value={formFields.phoneNumber} onChange={onChangeInput}/>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <h6> Email address *</h6>
                                    <div className="form-group">
                                        <TextField label="Email " variant="outlined" className="w-100" name="email" value={formFields.email} onChange={onChangeInput}/>
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
                                {/* <Button type="submit" className='btn-blue bg-red btn-lg btn-big ml-1' onClick={checkout}><IoBagCheckOutline/> &nbsp; Check out</Button>*/}
                                <div className="pay-button">
                                    {/* <PayPalButtons
                                        style={{ layout: "vertical" }}
                                        createOrder={(data, actions) => {
                                            return actions.order.create({
                                                purchase_units: [{
                                                    amount: {
                                                        value: totalAmount.toString()
                                                    }
                                                }]
                                            });
                                        }}
                                        onApprove={onApprove}
                                    /> */}
                                    {totalAmount && (
                                            <PayPalButtons
                                                style={{ layout: "vertical" }}
                                                createOrder={(data, actions) => {
                                                    return actions.order.create({
                                                        purchase_units: [{ amount: { value: totalAmount.toString() } }]
                                                    });
                                                }}
                                                onApprove={onApprove}
                                            />
                                        )}
                                    </div>
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
