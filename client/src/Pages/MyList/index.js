import { Link, useNavigate } from "react-router-dom";
import Rating from '@mui/material/Rating';
import { IoMdClose } from "react-icons/io";
import Button from '@mui/material/Button';
import { MyContext } from "../../App";
import { useContext, useEffect, useState } from "react";
import { deleteData, fetchDataFromAPI } from "../../utils/api";
import { FaHome } from "react-icons/fa";

const MyList = () => {
    const context = useContext(MyContext);
    const [myListData, setMyListData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const history = useNavigate();
    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(token!==null && token!==undefined && token!==""){
          setIsLogin(true);
        }else{
         history("/signIn");
        }
        const user = JSON.parse(localStorage.getItem("user"));
        fetchDataFromAPI(`/api/my-list?userId=${user?.userId}`).then((res)=>{
            setMyListData(res);
        })
      },[]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        fetchDataFromAPI(`/api/my-list?userId=${user?.userId}`).then((res) => {
            setMyListData(res);
        });
    }, []);

    const removeItem = (id) => {
        setIsLoading(true);
        deleteData(`/api/my-list/${id}`).then(() => {
            context.setAlertBox({
                open: true,
                error: false,
                msg: 'Item removed successfully from My List!'
            });
            const user = JSON.parse(localStorage.getItem("user"));
            fetchDataFromAPI(`/api/my-list?userId=${user?.userId}`).then((res) => {
                setMyListData(res);
                setIsLoading(false);
            });
        });
    };

    return (
        <>
            <section className="section cartPage">
                <div className="container">
                   
                    <div className="myListTableWrapper">
                    <h2 className="hd mb-0">My List</h2>
                    <p>There are <b className="text-red">{myListData.length}</b> products in your list</p>
                    {myListData.length > 0 ? (
                        <div className="table-responsive myListTable">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th width="50%">Product</th>
                                        <th width="15%">Unit Price</th>
                                        <th width="10%">Remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myListData.map((item) => (
                                        <tr key={item._id}>
                                            <td width="50%">
                                                <Link to={`/product/${item.productId}`}>
                                                    <div className="d-flex align-items-center cartItemimgWrapper">
                                                        <div className="imgWrapper">
                                                            <img src={item.image} className="w-100" alt={item.productTitle} />
                                                        </div>
                                                        <div className="info px-3">
                                                            <h6>{item?.productTitle}</h6>
                                                            <Rating name="read-only" value={parseInt(item.rating)} size="small" readOnly />
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td width="15%">
                                                Rs. {item.price}
                                            </td>
                                            <td width="10%">
                                                <span className="remove" onClick={() => removeItem(item._id)}>
                                                    <IoMdClose />
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="empty d-flex align-items-center justify-content-center flex-column">
                            <img src='shopping-cart.png' width="150" alt="Empty Cart" />
                            <br/>
                            <h3>Your List is currently empty</h3>
                            <br/>
                            <Link to="/">
                                <Button className="btn-blue bg-red btn-lg btn-big btn-round">
                                    <FaHome /> &nbsp; Continue Shopping
                                </Button>
                            </Link>
                        </div>
                    )}
                    </div>
                </div>
            </section>
            {isLoading && <div className="loading"></div>}
        </>
    );
};

export default MyList;
