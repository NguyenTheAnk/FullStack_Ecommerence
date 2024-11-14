import "bootstrap/dist/css/bootstrap.css";
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home  from "./Pages/Home";
import Header from "./Components/Header";
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import Footer from "./Components/Footer";
import ProductModal from "./Components/ProductModal";
import Listing from "./Pages/Listing";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import { fetchDataFromAPI, postData } from "./utils/api";
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import MyList from "./Pages/MyList";
import Checkout from "./Pages/Checkout";
import Orders from "./Pages/Orders";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import SearchPage from "./Pages/Search";
import MyAccount from "./Pages/MyAccount";
const MyContext = createContext();

function App() {

  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setselectedCountry] = useState('');
  const [isOpenProductModal, setisOpenProductModal] = useState({
    id:'',
    open: false
  });
  const [isHeaderFooterShow, setisHeaderFooterShow] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [productData, setProductData] = useState();
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [activeCat, setActiveCat] = useState('');

  const [addingInCart, setAddingInCart] = useState(false);
  const [cartData, setCartData] = useState();
  const [searchData, setSearchData] = useState([]);
  const [alertBox, setAlertBox] = useState({
    msg:'',
    error: false,
    open:false
  });
  const initialOptions = {
    "client-id": "AaCP2mCf9dgzQNT2DIBCIoJT86cMKBIFSHrZi4sISarqQMXmfnAhoc6_lezq-deEIzbwDql6IMEhRKWT",
    currency: "USD",
    intent: "capture",
  };
  const [user, setUser] = useState({
    name: "",
    email: "",
    userId:""
  })
  // const [cartItemLength, setartItemLength] = useState();
  useEffect(() => {
    getCountry("https://countriesnow.space/api/v0.1/countries/");

    const catArr =[];
    fetchDataFromAPI('/api/category').then((res)=>{
      setCategoryData(res.categoryList);
      setActiveCat(res.categoryList?.name);
      // console.log(res.categoryList[0]?.name)
    });
    fetchDataFromAPI('/api/subCat').then((res)=>{
      setSubCategoryData(res.subCategoryList);
    });
    fetchDataFromAPI(`/api/cart`).then((res)=>{
      setCartData(res);
    })

  }, []);

  useEffect(()=>{
    const location = localStorage.getItem('location');
    if(location !==null && location !== undefined && location !== ""){
      setselectedCountry(location);
    }
  },[])
  useEffect(()=>{
    isOpenProductModal.open === true &&
    fetchDataFromAPI(`/api/products/${isOpenProductModal.id}`).then((res)=>{
      setProductData(res);
    })
    

  },[isOpenProductModal])
  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(token!==null && token!==undefined && token!==""){
      setIsLogin(true);
      const userData = JSON.parse(localStorage.getItem("user"));
      setUser(userData);
    }else{
      setIsLogin(false);
    }
  },[isLogin]);
  const handleClose = (event,reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlertBox({
      open: false,
      msg: ''
    });
  };
  
  const getCartData=()=>{
    fetchDataFromAPI(`/api/cart`).then((res)=>{
      setCartData(res);
    })
  }
    const getCountry = async(url)=>{
      const responsive = await axios.get(url).then((res)=>{
        setCountryList(res.data.data)
        console.log(res.data.data)
      });
    }
    const addToCart =(data)=>{
     
      setAddingInCart(true);
      postData(`/api/cart/add`,data).then((res)=>{
        if(res.status !== false){
            setAlertBox({
              open: true,
              error: false,
              msg: 'Product added to cart successfully'
            });
            setTimeout(()=>{
              setAddingInCart(false);
            },1000)
            getCartData();
        }else{
          setAlertBox({
            open: true,
            error: true,
            msg: res.msg
          });
          setAddingInCart(false);
        }
       
      })
    }
    <PayPalScriptProvider options={initialOptions}>
        <Checkout/>
    </PayPalScriptProvider>
  const values ={
    countryList,
    setselectedCountry,
    selectedCountry,
    isOpenProductModal,
    setisOpenProductModal,
    isHeaderFooterShow,
    setisHeaderFooterShow,
    isLogin,
    setIsLogin,
    categoryData,
    setCategoryData,
    subCategoryData,
    setSubCategoryData,
    activeCat,
    alertBox, 
    setAlertBox,
    setUser,
    user,
    addToCart,
    addingInCart,
    setAddingInCart,
    cartData,
    setCartData,
    getCartData,
    searchData, 
    setSearchData
  }

  return (
    <BrowserRouter>
      <MyContext.Provider value={values}>
          <Snackbar open={alertBox.open} autoHideDuration={6000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity={alertBox.error===true ? 'error' : 'success'}
              variant="filled"
              sx={{ width: '100%' }}
            >
              {alertBox.msg}
            </Alert>
          </Snackbar>
        {
          isHeaderFooterShow === true && <Header/>
        }
        
          <Routes>
            <Route path="/" exact={true} element={<Home/>} />
            <Route path="/cat/:catId" exact={true} element={<Listing/>} />
            <Route path="/subCat/:subCatId" exact={true} element={<Listing/>} />
            <Route path="/product/:id" exact = {true} element= {<ProductDetails/>} />
            <Route path="/cart" exact = {true} element= {<Cart/>} />
            <Route path="/signIn" exact = {true} element= {<SignIn/>} />
            <Route path="/signUp" exact = {true} element= {<SignUp/>} />
            <Route path="/my-list" exact = {true} element= {<MyList/>} />
            <Route path="/checkout" exact = {true} element= {<Checkout/>} />
            <Route path="/orders" exact = {true} element= {<Orders/>} />
            <Route path="/search" exact = {true} element= {<SearchPage/>} />
            <Route path="/my-account" exact = {true} element= {<MyAccount/>} />
          </Routes>
          {
          isHeaderFooterShow === true && <Footer/>
        }
          
          {
            isOpenProductModal.open === true && <ProductModal data={productData}/>
        }
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;

export {MyContext}