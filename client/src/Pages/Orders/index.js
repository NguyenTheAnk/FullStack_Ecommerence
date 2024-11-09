import React, { useEffect, useState } from "react";
import { fetchDataFromAPI } from "../../utils/api";
import Pagination from '@mui/material/Pagination';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import { IoMdClose } from "react-icons/io";
const Orders = ()=>{
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);

    const [isOpenModal, setIsOpenModal] = useState(false);
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
    return(
        <>
        <section className="section">
            <div className="container">
                <h2 className="hd">Orders</h2>

                <div className="table-responsive orderTable">
                    <table className="table table-striped table-bordered" >
                        <thead className="thead-light">
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
                                            <span className="badge badge-danger">{item?.status}</span>
                                            :
                                            <span className="badge badge-success">{item?.status}</span>
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
        </section>
         <Dialog open={isOpenModal} className="productModal">
            <Button className='close_' onClick={()=>setIsOpenModal(false)}><IoMdClose /></Button>
            <h4 className="mb-1 font-weight-bold pr-5 mb-4">Products</h4>
            <div className="table-responsive orderTable">
            <table className="table table-striped table-bordered" >
                        <thead className="thead-light">
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
}
export default Orders;