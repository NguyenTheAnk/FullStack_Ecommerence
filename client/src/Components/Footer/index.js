import { IoShirtOutline } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { TbRosetteDiscount } from "react-icons/tb";
import { PiMoneyWavy } from "react-icons/pi";
import { Link } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";
import { IoLogoTwitter } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";
import { useState } from "react";
import { useEffect } from "react";
import { fetchDataFromAPI } from "../../utils/api";
const Footer = () =>{
    const [subCatData, setSubCatData] = useState([]);
    useEffect(() => {
        window.scrollTo(0, 0);
        fetchDataFromAPI('/api/subCat').then((res)=>{
            setSubCatData(res);
        })
    },[]);
    const groupedCategories = subCatData?.subCategoryList?.reduce((acc, item) => {
        const categoryName = item.category.name; // lấy tên của category
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(item.subCat); // thêm subCat vào category tương ứng
        return acc;
    }, {});
    return(
        <footer>
            <div className="container">
                <div className="topInfo row">
                    <div className="col d-flex align-items-center">                       
                        <span><IoShirtOutline/></span>
                        <span className="ml-3">Every fresh products</span>
                    </div>
                    <div className="col d-flex align-items-center">                       
                        <span><TbTruckDelivery/></span>
                        <span className="ml-3">Free delivery for order over $70</span>
                    </div>
                    <div className="col d-flex align-items-center">                       
                        <span><TbRosetteDiscount/></span>
                        <span className="ml-3">Daily Mega Discounts</span>
                    </div>
                    <div className="col d-flex align-items-center">                       
                        <span><PiMoneyWavy/></span>
                        <span className="ml-3">Best price on the market</span>
                    </div>
                </div>
                <div className="row mt-4 linksWrap">
                    {groupedCategories && Object.entries(groupedCategories).length > 0 ? (
                        Object.entries(groupedCategories).map(([categoryName, subCategories], index) => (
                            <div className="col" key={index}>
                                <h5>{categoryName}</h5>
                                <ul>
                                    {subCategories.map((subCat, subIndex) => (
                                        <li key={subIndex}>
                                            <Link to="#">{subCat}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <div className="col">
                            <p>No categories available.</p>
                        </div>
                    )}
                </div>
               
                <div className="copyright mt-3 pt-3 pb-3 d-flex">
                    <p className="mb-0">Copyright 2024. All rights reserved</p>
                    <ul className="list list-inline ml-auto mb-0 socials">
                        <li className="list-inline-item">
                            <Link to="#"><FaFacebookF/></Link>
                        </li>
                        <li className="list-inline-item">
                            <Link to="#"><IoLogoTwitter/></Link>
                        </li>
                        <li className="list-inline-item">
                            <Link to="#"><FaInstagram/></Link>
                        </li>
                    </ul>
                </div>
            </div>
    
        </footer>
    )
}

export default Footer;