import { Link } from 'react-router-dom';
import Logo from '../../assets/images/logo.png';
import CountryDropdown from '../CountryDropdown';
import  Button from '@mui/material/Button';
import { FiUser } from "react-icons/fi";
import { IoBagOutline } from "react-icons/io5";
import SearchBox from './SearchBox';
import Navigation from './Navigations';
import React, { useContext } from 'react';
import { MyContext } from "../../App";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchDataFromAPI } from '../../utils/api';
import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import { FaCircleUser } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { IoBagCheck } from "react-icons/io5";
const Header = () =>{
    const [catData, setCatData]= useState([]);
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event => {
        setAnchorEl(event.currentTarget);
    });
    const handleClose = () => {
        setAnchorEl(null);
    };
    const viewCartDetails = () => {
        navigate(`/cart`);
    }
    useEffect(()=>{
        fetchDataFromAPI("/api/category/").then((res)=>{
             setTimeout(()=>{
                setCatData(res);
             },3000)
            

        });
     
     },[]);

     const logout=()=>{
        setAnchorEl(null);
        localStorage.clear();
        context.setIsLogin(false);
     }
    return (  
        <>
        
         <div className="headerWrapper">
            <div className="top-strip bg-blue">
                <div className="container">
                    <p className="mb-0 mt-0 text-center"> <b>Welcome to our e-commerce store!</b></p>
                </div>
            </div>
            <header className="header">
                <div className="container">
                    <div className="row">
                        <div className="logoWrapper d-flex align-items-center col-sm-2">
                                <Link to={'/'}><img src={Logo} alt='Logo' /></Link>
                        </div>

                        <div className='col-sm-10 d-flex align-items-center part2'>                            
                            {
                                context.countryList.length!==0 && <CountryDropdown />
                            }
                            <SearchBox/>

                                <div className='part3 d-flex align-items-center ml-auto'>
                                    {
                                        context.isLogin !== true ? <Link to="/signIn"><Button className='btn-blue btn-round mr-3'>Sign In</Button></Link>  :
                                        <>
                                        <Button className='circle mr-3'  onClick={handleClick}><FiUser/></Button>
                                         <Menu
                                                anchorEl={anchorEl}
                                                id="accDrop"
                                                open={open}
                                                onClose={handleClose}
                                                onClick={handleClose}
                                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                            >
                                                <MenuItem onClick={handleClose}>
                                                <ListItemIcon>
                                                    <FaCircleUser fontSize="small" />
                                                </ListItemIcon>
                                                My Account
                                                </MenuItem>
                                                <Link to="/orders">
                                                    <MenuItem onClick={handleClose}>
                                                    <ListItemIcon>
                                                        <IoBagCheck fontSize="small" />
                                                    </ListItemIcon>
                                                    Orders
                                                    </MenuItem>
                                                </Link>
                                                <Link to="/my-list">
                                                    <MenuItem onClick={handleClose}>
                                                    <ListItemIcon>
                                                        <FaHeart fontSize="small" />
                                                    </ListItemIcon>
                                                    My List
                                                </MenuItem>
                                                </Link>
                                                <MenuItem onClick={logout}>
                                                <ListItemIcon>
                                                    <MdLogout fontSize="small" />
                                                </ListItemIcon>
                                                Logout
                                                </MenuItem>
                                            </Menu>
                                        </>
                                       
                                    }
                                     
                                  
                                    <div className='ml-auto cartTab d-flex align-items-center'>
                                        <span className='price'>$ &nbsp;
                                        {
                                            context.cartData?.length
                                                ? context.cartData.map(item => parseInt(item.price) * item.quantity)
                                                    .reduce((total, value) => total + value, 0)
                                                : '0'
                                        }

                                        </span>
                                        <div className='position-relative ml-2'>
                                            <Button className='circle ' onClick={() => viewCartDetails()} style={{ cursor: 'pointer' }}><IoBagOutline/></Button>
                                            <span className='count d-flex align-items-center justify-content-center'>{context.cartData?.length}</span>
                                        </div>
                                        
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </header>
            
            {
                
                context.catData?.categoryList?.length!==0 &&  <Navigation navData ={catData}/>           
                
            }
           
        </div>
        </>
    )
}

export default Header;