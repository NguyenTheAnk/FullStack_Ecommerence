import React from "react";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Chip, emphasize, Pagination, styled } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect } from "react";
import { editData, fetchDataFromAPI } from "../../utils/api";
import { useState } from "react";
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import { IoMdClose } from "react-icons/io";
const label = {inputProps: {'aria-label': 'Checkbox demo'}};
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
const Orders =()=>{
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(1);
    const [products, setProducts] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [singleOrder, setSingleOrder] = useState();
    useEffect(()=>{
        window.scrollTo(0,0);
        fetchDataFromAPI("/api/orders?page=1&perPage=8").then((res)=>{
            setOrders(res);
        })
    },[]);
    const handleChange =(event, value)=>{
        setPage(value);
        fetchDataFromAPI(`/api/orders?page=${value}&perPage=8`).then((res)=>{
            setOrders(res);
            window.scrollTo({
                top:200,
                behavior: "smooth",
            })
        })
    }
    const showProducts=(id)=>{
        fetchDataFromAPI(`/api/orders/${id}`).then((res)=>{
         setIsOpenModal(true);
         setProducts(res.products);
        });
     }

     const orderStatus=(orderStatus,id)=>{
        fetchDataFromAPI(`/api/orders/${id}`).then((res)=>{
            const order = {
                name: res.name,
                phoneNumber: res.phoneNumber,
                address: res.address,
                pincode: res.pincode,
                amount: parseInt(res.amount),
                email: res?.email,
                userId: res?.userId,
                products: res.products,
                paymentId: res.paymentId,
                status: orderStatus,
            }
            console.log(order);
            editData(`/api/orders/${id}`, order).then((res)=>{
                fetchDataFromAPI(`/api/orders?page=${1}&perPage=8`).then((res)=>{
                    setOrders(res);
                    window.scrollTo({
                        top:200,
                        behavior: "smooth",
                    })
                })
            })
            setSingleOrder(res.products);
           });
     }
    return(
        <>
         <div className="right-content w-100">
                    <div className="card shadow border-0 w-100 flex-row p-4">
                        <h5 className="mb-0">Orders List</h5>
                        <div className="ml-auto d-flex align-items-center">
                        <Breadcrumbs aria-label="breadcrumbs" className="ml-auto breadcrumbs_">
                            <StyleBreadrumb
                                component="a"
                                href="/"
                                label="Home"
                                icon={<HomeIcon fontSize="small" />}
                                style={{ cursor: "pointer" }}
                                />
                                <StyleBreadrumb
                                component="a"
                                label="Orders"
                                deleteIcon={<ExpandMoreIcon />}
                            />
                              
                        </Breadcrumbs>
                        </div>
                    </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <div className="row cardFilters mt-2">                       
                        <div className="table-responsive orderTable">
                            <table className="table table-bordered v-align customTable">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>Payment Id</th>
                                            <th>Products</th>
                                            <th>Name</th>
                                            <th>Phone Number</th>
                                            <th>Address</th>
                                            <th>Pincode</th>
                                            <th>Total amount</th>
                                            <th>Email</th>
                                            <th>User Id</th>
                                            <th>Order Status</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                            orders?.ordersList?.length!==0 && orders?.ordersList?.map((item, index)=>{
                                                return(
                                                    <>
                                                    <tr key={index}>
                                                        <td><span className="text-blue font-weight-bold">{item?.paymentId}</span></td>
                                                        <td><span className="text-blue font-weight-bold cursor" onClick={()=> showProducts(item?._id)}>Click here to view</span>                                         
                                                        </td>
                                                        <td>{item?.name}</td>
                                                        <td>{item?.phoneNumber}</td>
                                                        <td>{item?.address}</td>
                                                        <td>{item?.pincode}</td>
                                                        <td>$ {item?.amount}</td>
                                                        <td>{item?.email}</td>
                                                        <td>{item?.userId}</td>
                                                        <td>
                                                            {item?.status==="Pending" ?
                                                            <span className="badge badge-danger cursor" onClick={()=>orderStatus("Confirm", item?._id)}>{item?.status}</span>
                                                            :
                                                            <span className="badge badge-success cursor" onClick={()=>orderStatus("Pending", item?._id)}>{item?.status}</span>
                                                        }
                                                        </td>
                                                        <td>{item?.date}</td>
                                                    </tr>
                                                                
                                                    </>
                                                )
                                            })
                                        }
                                                                             
                                    </tbody>
                            </table>                 
                                                  
                        </div>
                            {
                                orders?.ordersList?.totalPages >1 && 
                                <div className="d-flex tableFooter">
                                    <Pagination count={ orders?.ordersList?.totalPages} color="primary"
                                    className="pagination" showFirstButton showLastButton onChange={handleChange}
                                    />
                                </div>
                            }
                    </div>
                </div>
            </div>
            <Dialog open={isOpenModal} className="productModal">
            <Button className='close_' onClick={()=>setIsOpenModal(false)}><IoMdClose /></Button>
            <h4 className="mb-1 font-weight-bold pr-5 mb-4">Products</h4>
            <div className="table-responsive orderTable">
            <table className="table table-striped table-bordered customTable" >
                        <thead className="thead-dark">
                            <tr>
                                <th>Product Id</th>
                                <th>Product Title</th>
                                <th>Image</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>SubTotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                products?.length!==0 && products?.map((item, index)=>{
                                    return(
                                        <tr>
                                            <td>{item?.productId}</td>
                                            <td style={{whiteSpace:"inherit"}}><span>
                                                {item?.productTitle.substr(0,30) + '...'}
                                            </span></td>
                                            <td><div className="img"><img src={item?.image} alt=""/></div></td>
                                            <td>{item?.quantity}</td>
                                            <td>{item?.price}</td>
                                            <td>{item?.subTotal}</td>
                                        </tr>
                                    )
                                })
                            }
                           
                        </tbody>
            </table>
            </div>
         </Dialog>
        </>
    )
};

export default Orders;