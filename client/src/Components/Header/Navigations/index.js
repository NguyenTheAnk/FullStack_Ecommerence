import { IoIosMenu } from "react-icons/io";
import  Button from '@mui/material/Button';
import { FaAngleDown } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { fetchDataFromAPI } from "../../../utils/api";

const Navigation = (props) =>{

    const [isopenSidebarVal, setisopenSidebarVal] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [subCatData, setSubCatData]= useState([]);
    useEffect(()=>{
        fetchDataFromAPI("/api/subCat/").then((res)=>{
            setTimeout(()=>{
                setSubCatData(res);
            },3000)
        });
     
     },[]);
    return (
        <nav>
                <div className='container'>
                    <div className='row'>
                        <div className='col-sm-2 navPart1'>
                            <div className="catWrapper">
                                <Button className='allCatTab align-items-center' onClick={() => setisopenSidebarVal(!isopenSidebarVal)}>
                                    <span className="icon1 mr-2"><IoIosMenu/></span>
                                    <span class="text">ALL CATEGORY</span>
                                    <span className="icon2 ml-2"><FaAngleDown/></span>
                                </Button>

                                <div className={`sidebarNav ${isopenSidebarVal === true ?'open' : ''}`}>
                                    <ul>
                                        {
                                            props.navData?.categoryList?.length!== 0 && props.navData?.categoryList?.map((item, index)=>{   
                                                const subCategories = subCatData?.subCategoryList?.filter(subCat => subCat.category._id === item._id);     
                                                return(
                                                    <li className="list-inline-item" key={index}
                                                        onMouseEnter={() => setHoveredCategory(item._id)}
                                                        onMouseLeave={() => setHoveredCategory(null)}
                                                    >
                                                        <Link to={`/cat/${item._id}`}><Button className="d-flex align-items-center">
                                                        <img src={item?.images[0]} alt=''/>
                                                            {item?.name}
                                                            </Button>
                                                        </Link>
                                                        {hoveredCategory === item._id && subCategories?.length !== 0 && (
                                                        <div className="submenu">
                                                            {subCategories?.map((subItem, subIndex) => (
                                                                <Link key={subIndex} to={`/subCat/${subItem._id}`}>
                                                                    <Button>{subItem?.subCat}</Button>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}
                                                        </li>
                                                    
                                                    
                                                )
                                            })
                                   
                                        }
                                           
                                        
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className='row col-sm-10 navPart2 d-flex align-items-center'>
                            <ul className="list list-inline ml-auto">
                                {
                                            props.navData?.categoryList?.length!== 0 && props.navData?.categoryList?.map((item, index)=>{   
                                                const subCategories = subCatData?.subCategoryList?.filter(subCat => subCat.category._id === item._id);     
                                                return(
                                                    <li className="list-inline-item" key={index}
                                                        onMouseEnter={() => setHoveredCategory(item._id)}
                                                        onMouseLeave={() => setHoveredCategory(null)}
                                                        >
                                                        <Link to={`/cat/${item?._id}`}>
                                                            <Button>
                                                                <img src={item?.images[0]} alt=''/>
                                                                {item?.name}
                                                            </Button>
                                                        </Link>
                                                        {hoveredCategory === item._id && subCategories?.length !== 0 && (
                                                        <div className="submenu">
                                                            {subCategories?.map((subItem, subIndex) => (
                                                                <Link key={subIndex} to={`/subCat/${subItem._id}`}>
                                                                    <Button>{subItem?.subCat}</Button>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}
                                                        </li>
                                                    
                                                    
                                                )
                                            })
                                   
                                        }
                             </ul>   
                        </div>
                    </div>
                </div>
            </nav>
    )
}

export default Navigation;