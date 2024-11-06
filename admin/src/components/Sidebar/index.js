import Button from '@mui/material/Button';
import { MdDashboard } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa6";
import { FaProductHunt } from "react-icons/fa6";
// import { FaShoppingCart } from "react-icons/fa";
// import { MdMessage } from "react-icons/md";
// import { IoMdNotifications } from "react-icons/io";
// import { FaUser } from "react-icons/fa";
// import { IoSettingsSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { IoMdLogOut } from "react-icons/io";
import { MyContext } from '../../App';
const Sidebar = () => {

    const [activeTab, setActiveTab] =useState(0);
    const [isToggleSubmenu, setIsToggleSubmenu] =useState(false);

    const context = useContext(MyContext);
    const isOpenSubmenu= (index)=>{
        setActiveTab(index);
        setIsToggleSubmenu(!isToggleSubmenu);
    }
    return (
        <>
            <div className="sidebar">
                <ul>
                    <li> 
                        <Link to="/">
                            <Button className={`w-100 ${activeTab===0 ? 'active' : ''}`} onClick={()=> isOpenSubmenu(0)}> 
                                <span className='icon'><MdDashboard/></span>Dashboard
                                <span className='arrow'><FaAngleRight/></span>
                            </Button>
                        </Link>
                    </li>
                    <li> 
                            <Button className={`w-100 ${activeTab===1 && isToggleSubmenu===true ? 'active' : ''}`} onClick={()=> isOpenSubmenu(1)}> 
                                
                                    <span className='icon'><FaProductHunt/></span>Products
                                    <span className='arrow'><FaAngleRight/></span>
                            </Button>
                            <div className={`submenuWrapper ${activeTab===1 && isToggleSubmenu===true ? 'colapse' : 'colapsed'}`}>
                                <ul className='submenu'>
                                    <li><Link to="/products">Product List</Link></li>
                                    <li><Link to="/product/upload">Product Upload</Link></li>
                                    <li><Link to="/productRAMS/add">Add Product RAMS</Link></li>
                                    <li><Link to="/productWeight/add">Add Product WEIGHT</Link></li>
                                    <li><Link to="/productSize/add">Add Product SIZE</Link></li>
                                </ul>
                            </div>
                           
                    </li>
                    <li> 
                            <Button className={`w-100 ${activeTab===2 && isToggleSubmenu===true ? 'active' : ''}`} onClick={()=> isOpenSubmenu(2)}> 
                                
                                    <span className='icon'><FaProductHunt/></span>Category
                                    <span className='arrow'><FaAngleRight/></span>
                            </Button>
                            <div className={`submenuWrapper ${activeTab===2 && isToggleSubmenu===true ? 'colapse' : 'colapsed'}`}>
                                <ul className='submenu'>
                                    <li><Link to="/category">Category List</Link></li>
                                    <li><Link to="/category/add">Add Category</Link></li>
                                    <li><Link to="/subCategory">Sub Category List</Link></li>
                                    <li><Link to="/subCategory/add">Add Sub Category</Link></li>
                                </ul>
                            </div>
                           
                    </li>
                    {/* <li> 
                        <Link to="/">
                        <Button className={`w-100 ${activeTab===2 ? 'active' : ''}`} onClick={()=> isOpenSubmenu(2)}> 
                                <span className='icon'><FaShoppingCart/></span>Orders
                                <span className='arrow'><FaAngleRight/></span>
                            </Button>
                        </Link>
                    </li>
                    <li> 
                        <Link to="/">
                        <Button className={`w-100 ${activeTab===3 ? 'active' : ''}`} onClick={()=> isOpenSubmenu(3)}> 
                                <span className='icon'><MdMessage/></span>Messages
                                <span className='arrow'><FaAngleRight/></span>
                            </Button>
                            </Link>
                    </li>
                    <li> 
                        <Link to="/">
                        <Button className={`w-100 ${activeTab===4 ? 'active' : ''}`} onClick={()=> isOpenSubmenu(4)}>  
                            <span className='icon'><IoMdNotifications/></span>Notifications
                            <span className='arrow'><FaAngleRight/></span>
                        </Button>
                        </Link>
                    </li>
                    <li> 
                    <Link to="/">
                    <Button className={`w-100 ${activeTab===5 ? 'active' : ''}`} onClick={()=> isOpenSubmenu(5)}> 
                            <span className='icon'><IoSettingsSharp/></span>Settings
                            <span className='arrow'><FaAngleRight/></span>
                        </Button>
                        </Link>
                    </li>
                    <li> 
                    <Link to="/">
                    <Button className={`w-100 ${activeTab===6 ? 'active' : ''}`} onClick={()=> isOpenSubmenu(6)}> 
                            <span className='icon'><FaUser/></span>Login
                        </Button>
                        </Link>
                    </li>
                    <li> 
                    <Link to="/">
                    <Button className={`w-100 ${activeTab===7 ? 'active' : ''}`} onClick={()=> isOpenSubmenu(7)}>  
                            <span className='icon'><FaUser/></span>Sign Up
                        </Button>
                        </Link>
                    </li> */}

                </ul>

                <br/>
                <div className='logoutWrapper'>
                    <div className='logoutBox'>
                        <Button variant="contained"><IoMdLogOut/>Logout</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar;