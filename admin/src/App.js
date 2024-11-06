import {BrowserRouter, Route, Routes} from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import React, { createContext, useEffect, useState } from 'react';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import ProductUpload from './pages/Products/addProduct';
import CategoryAdd from './pages/Category/AddCat';
import CategoryList from './pages/Category/categoryList';
import { Snackbar } from '@mui/material';
import LoadingBar from 'react-top-loading-bar'
// import Snackbar from '@mui/material/Snackbar';
// import Alert from '@mui/material/Alert';
import Alert from '@mui/material/Alert';
import EditCategory from './pages/Category/editCat';
import EditSubCategory from './pages/Category/editSubCat';
import EditProduct from './pages/Products/editProduct';
import { fetchDataFromAPI } from '././utils/api';
import AddSubCat from './pages/Category/addSubCat';
import SubCategoryList from './pages/Category/subCategoryList';
import AddProductRAMS from './pages/Products/addProductRAMS';
import AddProductWeight from './pages/Products/addProductWeight';
import AddProductSize from './pages/Products/addProductSize';
const MyContext = createContext();

function App() {

  const[isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isHideSidebarAndHeader, setIsHideSidebarAndHeader] = useState(false);
  const [themeMode, setThemeMode] = useState(true);
  const [baseUrl, setBaseUrl] = useState("http://localhost:4000");
  const [catData, setCatData] = useState([]);
  const [subCatData, setSubCatData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [user, setUser] = useState({
    name: "",
    email: "",
    userId:""
  })
  const [alertBox, setAlertBox] = useState({
    msg:'',
    error: false,
    open:false
  });


  useEffect(() =>{
    if(themeMode === true){
      document.body.classList.remove('dark');
      document.body.classList.add('light');
      localStorage.setItem('themeMode','light');
    }
    else{
      document.body.classList.remove('light');
      document.body.classList.add('dark');
      localStorage.setItem('themeMode','dark');
    }
   
  },[themeMode]);

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

  useEffect(()=>{
    setProgress(20);
    fetchCategory();
    fetchSubCategory();
  },[])

  const fetchCategory = () => {
    fetchDataFromAPI('/api/category').then((res)=>{
      setCatData(res);
      setProgress(100)
  })
  };
  const fetchSubCategory = () => {
    fetchDataFromAPI('/api/subCat').then((res)=>{
      setSubCatData(res);
      setProgress(100)
  })
  };
  const values= {
    isToggleSidebar,
    setIsToggleSidebar,
    isLogin,
    setIsLogin,
    isHideSidebarAndHeader,
    setIsHideSidebarAndHeader,
    themeMode,
    setThemeMode,
    alertBox, 
    setAlertBox,
    setProgress,
    baseUrl,
    catData,
    fetchCategory,
    subCatData,
    fetchSubCategory,
    setUser,
    user
  }

  const handleClose = (event,reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlertBox({
      open: false,
      msg: ''
    });
  };

  return (
    <BrowserRouter>
    <MyContext.Provider value={values}>
    <LoadingBar
        color='#f11946'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        className='topLoadingBar'
      />
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
          isHideSidebarAndHeader !== true &&
          <Header/>
    }
      
      <div className='main d-flex'>
        {
          isHideSidebarAndHeader !== true &&
          <div className={`sidebarWrapper ${isToggleSidebar ===true ? 'toggle' : ''}`}>
          <Sidebar/>
        </div>
        }
       
        <div className={`content ${isHideSidebarAndHeader === true && 'full'} ${isToggleSidebar ===true ? 'toggle' : ''}`}>
          <Routes>
            <Route path = "/" exact= {true} element= {<Dashboard/>}/>
            <Route path = "/dashboard" exact= {true} element= {<Dashboard/>}/>
            <Route path = "/login" exact= {true} element= {<Login/>}/>
            <Route path = "/signUp" exact= {true} element= {<SignUp/>}/>
            <Route path = "/products" exact= {true} element= {<Products/>}/>
            <Route path = "/product/details" exact= {true} element= {<ProductDetails/>}/>
            <Route path = "/product/upload" exact= {true} element= {<ProductUpload/>}/>
            <Route path = "/product/edit/:id" exact= {true} element= {<EditProduct/>}/>
            <Route path = "/category" exact= {true} element= {<CategoryList/>}/>
            <Route path = "/category/add" exact= {true} element= {<CategoryAdd/>}/>
            <Route path = "/category/edit/:id" exact= {true} element= {<EditCategory/>}/>
            <Route path = "/subCategory/edit/:id" exact= {true} element= {<EditSubCategory/>}/>
            <Route path = "/subCategory" exact= {true} element= {<SubCategoryList/>}/>
            <Route path = "/subCategory/add" exact= {true} element= {<AddSubCat/>}/>
            <Route path = "/productRAMS/add" exact= {true} element= {<AddProductRAMS/>}/>
            <Route path = "/productWeight/add" exact= {true} element= {<AddProductWeight/>}/>
            <Route path = "/productSize/add" exact= {true} element= {<AddProductSize/>}/>
          </Routes>
        </div>
      </div>
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
export {MyContext};
