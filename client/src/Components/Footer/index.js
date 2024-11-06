import { IoShirtOutline } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { TbRosetteDiscount } from "react-icons/tb";
import { PiMoneyWavy } from "react-icons/pi";
import { Link } from "react-router-dom";
import { FaFacebookF } from "react-icons/fa";
import { IoLogoTwitter } from "react-icons/io5";
import { FaInstagram } from "react-icons/fa";
const Footer = () =>{
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
                    <div className="col">
                        <h5> QUẦN ÁO</h5>
                        <ul>
                            <li>
                                <Link to="#">Áo khoác</Link>
                            </li>
                            <li>
                                <Link to="#">Áo Vest và Blazer</Link>
                            </li>
                            <li>
                                <Link to="#">Quần Jeans</Link>
                            </li>
                            <li>
                                <Link to="#">Quần Short</Link>
                            </li>
                            <li>
                                <Link to="#">Khác</Link>
                            </li>

                        </ul>
                    </div>
                    <div className="col">
                        <h5> GIÀY DÉP</h5>
                        <ul>
                            <li>
                                <Link to="#">Giày Sneaker</Link>
                            </li>
                            <li>
                                <Link to="#">Giày Tây</Link>
                            </li>
                            <li>
                                <Link to="#">Xăng-Đan và Dép</Link>
                            </li>
                            <li>
                                <Link to="#">Khác</Link>
                            </li>

                        </ul>
                    </div>
                    <div className="col">
                        <h5> ĐỒNG HỒ</h5>
                        <ul>
                            <li>
                                <Link to="#">Đồng Hồ Nam</Link>
                            </li>
                            <li>
                                <Link to="#">Đồng Hồ Nữ</Link>
                            </li>
                            <li>
                                <Link to="#">Đồng Hồ Trẻ Em</Link>
                            </li>
                            <li>
                                <Link to="#">Phụ Kiện Đồng Hồ</Link>
                            </li>
                            <li>
                                <Link to="#">Khác</Link>
                            </li>

                        </ul>
                    </div>
                    <div className="col">
                        <h5> TÚI XÁCH</h5>
                        <ul>
                            <li>
                                <Link to="#">Ba Lô Nữ</Link>
                            </li>
                            <li>
                                <Link to="#">Túi Quai Xách</Link>
                            </li>
                            <li>
                                <Link to="#">Ví/Bóp Nữ</Link>
                            </li>
                            <li>
                                <Link to="#">Phụ Kiện Túi</Link>
                            </li>
                            <li>
                                <Link to="#">Khác</Link>
                            </li>

                        </ul>
                    </div>
                    <div className="col">
                        <h5> PHỤ KIỆN</h5>
                        <ul>
                            <li>
                                <Link to="#">Dây Chuyền</Link>
                            </li>
                            <li>
                                <Link to="#">Nhẫn</Link>
                            </li>
                            <li>
                                <Link to="#">Khác</Link>
                            </li>

                        </ul>
                    </div>
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