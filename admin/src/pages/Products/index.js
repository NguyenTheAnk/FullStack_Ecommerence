

import { useContext, useEffect, useState } from "react";
import DashboardBox from "../Dashboard/components/dashboardBox";
import { FaUserCircle } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";
// import { GiStarsStack } from "react-icons/gi";
// import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
// import { IoIosTimer } from "react-icons/io";
import Button from '@mui/material/Button';
// import { BsThreeDotsVertical } from "react-icons/bs";
// import {Chart} from "react-google-charts";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FaEye } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { BiSolidTrashAlt } from "react-icons/bi";
import Pagination from '@mui/material/Pagination';
import { MyContext } from "../../App";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Checkbox, Chip, emphasize, Rating, styled } from "@mui/material";
import { Link } from "react-router-dom";
import { deleteData, fetchDataFromAPI } from "../../utils/api";
import { useNavigate } from 'react-router-dom';
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


const Products = () => {

    // const [anchorEl, setAnchorEl] = useState(null);
    const [showBy, setshowBy] = useState('');
    const [showBysetCatBy, setCatBy] = useState('');
    // const open = Boolean(anchorEl);
    // const ITEM_HEIGHT = 48;
    const [productData, setProductData] = useState([]);
    const context=  useContext(MyContext);

    useEffect(() => {
        context.setIsHideSidebarAndHeader(false);
        window.scrollTo(0, 0);
        context.setProgress(40);

        fetchDataFromAPI("/api/products").then((res)=>{
            console.log(res);
            setProductData(res);
            context.setProgress(100);
        })
    }, []);
    const history = useNavigate();
    const deleteProduct=(id)=>{
        context.setProgress(40);
        deleteData(`/api/products/${id}`).then((res)=>{
            context.setProgress(100);
            context.setAlertBox({
                open: true,
                error: false,
                msg: 'Product deleted successfully!'
            })
            fetchDataFromAPI("/api/products").then((res)=>{ 
                setProductData(res);
            })
        })
        history('/products');
    }
    const handleChange =(event, value)=>{
        context.setProgress(40)
        fetchDataFromAPI(`/api/products?page=${value}`).then((res)=>{
            setProductData(res);
            context.setProgress(100)
        })
    }
    return (
        <>
        <div className="right-content w-100">
                    <div className="card shadow border-0 w-100 flex-row p-4">
                        <h5 className="mb-0">Product List</h5>
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
                                href="/products"
                                label="Products"
                                deleteIcon={<ExpandMoreIcon />}
                                style={{ cursor: "pointer" }}
                            />
                              
                        </Breadcrumbs>
                        <Link to= "/product/upload"><Button className='btn-blue ml-3 pl-3 pr-3'>Add Product</Button></Link>
                        </div>
                    </div>
                <div className="row dashboardBoxWrapperRowV2">
                    <div className="col-md-12">
                        <div className="dashboardBoxWrapper d-flex">
                        <DashboardBox color = {["#1da256","#48d483"]} icon= {<FaUserCircle/>} grow = {true}/>
                        <DashboardBox color = {["#c012e2","#eb64fe"]} icon= {<FaShoppingCart/>}/>
                        <DashboardBox color = {["#2c78e5","#60aff5"]} icon= {<FaBagShopping/>}/>
                        {/* <DashboardBox color = {["#e1950e","#f3cd29"]} icon= {<GiStarsStack/>}/> */}
                    </div>
                    </div>
                    
                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <h3 className="hd">Best Selling Products </h3>
                    <div className="row cardFilters mt-3">
                        <div className="col-md-3">
                            <h4> SHOW BY</h4>
                        <FormControl className="w-100" size="small">
                            <Select
                                value={showBy}
                                onChange={(e)=>setshowBy(e.target.value)}
                                displayEmpty
                                inputProps={{'aria-label': 'Without label'}}
                                 labelId="demo-simple-select-helper-label"
                                className="w-100"
                                >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </FormControl>
                        </div>
                        <div className="col-md-3">
                            <h4> CATEGORY BY</h4>
                            <FormControl className="w-100" size="small">
                            <Select
                                value={showBysetCatBy}
                                onChange={(e)=>setCatBy(e.target.value)}
                                displayEmpty
                                inputProps={{'aria-label': 'Without label'}}
                                 labelId="demo-simple-select-helper-label"
                                className="w-100"
                                >
                                <MenuItem value="">
                                    <em value={null}>None</em>
                                </MenuItem>
                                {
                                                context.catData?.categoryList?.length!==0 && context.catData?.categoryList?.map((cat,index)=>{
                                                    return (
                                                        <MenuItem className='text-capitalize' value={cat.id} key={index}>{cat.name}</MenuItem>
                                                    )
                                                })
                                            }
                            </Select>
                            </FormControl>
                        </div>
                        <div className="col-md-3">
                            <h4> BRAND BY</h4>
                            <FormControl className="w-100" size="small">
                            <Select
                                value={showBy}
                                onChange={(e)=>setshowBy(e.target.value)}
                                displayEmpty
                                inputProps={{'aria-label': 'Without label'}}
                                 labelId="demo-simple-select-helper-label"
                                className="w-100"
                                >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                            </FormControl>
                        </div>
                        <div className="col-md-3">
                            <h4> SEARCH BY</h4>
                            <FormControl className="w-100" size="small">
                            <Select
                                value={showBy}
                                onChange={(e)=>setshowBy(e.target.value)}
                                displayEmpty
                                inputProps={{'aria-label': 'Without label'}}
                                 labelId="demo-simple-select-helper-label"
                                className="w-100"
                                >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                            </FormControl>
                        </div>

                        <div className="table-responsive mt-3">
                            <table className="table table-bordered v-align">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th style={{ width: "80px" }}>UID</th>
                                            <th style={{ width: "250px" }}>PRODUCT</th>
                                            <th style={{ width: "150px" }}>CATEGORY</th>
                                            <th style={{ width: "150px" }}>SUB CATEGORY</th>
                                            <th style={{ width: "120px" }}>BRAND</th>
                                            <th style={{ width: "100px" }}>PRICE</th>
                                            <th style={{ width: "100px" }}>STOCK</th>
                                            <th style={{ width: "120px" }}>PRODUCT RAMS</th>
                                            <th style={{ width: "150px" }}>PRODUCT WEIGHT</th>
                                            <th style={{ width: "120px" }}>PRODUCT SIZE</th>
                                            <th style={{ width: "100px" }}>DISCOUNT</th>
                                            <th style={{ width: "120px" }}>RATING</th>
                                            <th style={{ width: "200px" }}>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                  
                                        {
                                            
                                            productData?.productList?.length!==0 && productData?.productList?.map((item, index)=>{
                                                return(
                                                    <tr key={index}>
                                                        
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <Checkbox {...label}/>
                                                                <span>#{index +1}</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                        <div className="d-flex align-items-center productBox">
                                                            <div className="imgWrapper">
                                                                <div className="img card shadow m-0">
                                                                    <img src={item.images[0]} alt=""/>
                                                                </div>
                                                            </div>
                                                            <div className="info pl-3">
                                                                <h6>{item?.name}</h6>
                                                                <p>{item?.description}</p>
                                                            </div>
                                                        </div>
                                                            </td>
                                                        <td>{item?.category.name}</td>
                                                        <td>{item?.subCat.subCat}</td>
                                                        <td>{item?.brand}</td>
                                                        <td>
                                                                <div style={{width: '70px'}}>
                                                                    <del className="old">$ {item?.oldPrice}</del>
                                                                    <span className="new text-danger">$ {item?.price}</span>
                                                                </div>
                                                            </td>
                                                        <td>{item?.countInStock}</td>
                                                        <td>{item?.productRAMS?.map((ram)=>{
                                                            return(
                                                                <span className="badge badge-primary mr-2">{ram}</span>
                                                            )
                                                        })}</td>
                                                        <td>{item?.productWeight?.map((weight)=>{
                                                            return(
                                                                <span className="badge badge-primary mr-2">{weight}</span>
                                                            )
                                                        })}</td>
                                                        <td>{item?.productSize?.map((size)=>{
                                                            return(
                                                                <span className="badge badge-primary mr-2">{size}</span>
                                                            )
                                                        })}</td>
                                                        <td>{item?.discount}</td>
                                                        <td><Rating name="read-only" defaultValue={item?.rating} precision={0.5} size="small" readOnly/></td>
                                                        <td>
                                                            <div className="actions d-flex align-items-center">
                                                                <Link to={`/product/details/${item.id}`}>
                                                                    <Button className="secondary" color="secondary"><FaEye/></Button>
                                                                </Link>
                                                                <Link to={`/product/edit/${item.id}`}>
                                                                    <Button className="success" color="success"><FaPencilAlt/></Button>
                                                                </Link>
                                                                <Button className="error" color="error" onClick={()=>deleteProduct(item.id)}><BiSolidTrashAlt/></Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                                                               
                                    </tbody>
                            </table>
                            {
                                 productData?.totalPages>1 && 
                                 <div className="d-flex tableFooter">
                                    <p>showing <b>12</b> of <b>60</b> results</p>
                                    <Pagination count={productData?.totalPages} color="primary" className="pagination" showFirstButton showLastButton onChange={handleChange}/>      
                                </div>
                            }
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default Products;