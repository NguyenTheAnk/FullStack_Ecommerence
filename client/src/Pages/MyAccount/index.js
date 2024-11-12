import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { IoMdCloudUpload } from "react-icons/io";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { deleteData, deleteImages, editData, fetchDataFromAPI } from "../../utils/api";
import { MyContext } from '../../App';
import { postDataImg } from "../../../../client/src/utils/api";
import NoUserImg  from '../../assets/images/no-user.jpg'
function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }
  
  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  

const MyAccount = ()=>{
    const [isLogin, setIsLogin] = useState(false);
    const history = useNavigate();
    const [value, setValue] = React.useState(0);
    const [isLoading,setIsLoading] = useState(false);
    const [uploading,setUploading] = useState(false);
    const [previews, setPreviews] = useState([]);
    const [userData, setUserData] = useState([]);
    const formData = new FormData();
    const context = useContext(MyContext);
    const [formFields, setFormFields] = useState({
        name: '',
        email: '',
        phone: '',
        images: [],
    });
    const [fields, setFields] = useState({
        oldPassword: '',
        password: '',
        confirmPassword: '',
    });
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const changeInput= (e) => {
        setFormFields(()=> (
            {
                ...formFields,
                [e.target.name]: e.target.value
            }
        ))
    };
    const changeInput2= (e) => {
        setFields(()=> (
            {
                ...fields,
                [e.target.name]: e.target.value
            }
        ))
    };
    let img_arr= [];
    let uniqueArray=[];
    useEffect(()=>{
        window.scrollTo(0,0);

        const token = localStorage.getItem("token");
        if(token!==null && token!==undefined && token!==""){
          setIsLogin(true);
        }else{
         history("/signIn");
        }    
        
        
        deleteData("/api/imageUpload/deleteAllImages");
        const user = JSON.parse(localStorage.getItem("user"));
        fetchDataFromAPI(`/api/user/${user?.userId}`).then((res)=>{
            setUserData(res);
            setPreviews(res.images);
            setFormFields({
                name: res.name,
                email: res.email,
                phone: res.phone,
            });                   
        });
      },[]);
      const onChangeFile= async(e, apiEndPoint)=>{
        try{
            setPreviews([]);
            // const imgArr = [];
            const files = e.target.files;
            setUploading(true);
            // setImgFiles(e.target.files);
            for(var i=0; i < files.length; i++){
                
                if(files[i] && (files[i].type=== 'image/jpeg' || files[i].type==='image/jpg' || files[i].type==='image/png' || files[i].type==='image/webp')){
                    // setImgFiles(e.target.files);
                    const file = files[i];
                    formData.append(`images`, file);
                }
                else{
                    context.setAlertBox({
                        open: true,
                        error: true,
                        msg: 'Please select a valid JPG or PNG image file!'
                })
            }
        }
        }catch(error){
            console.log(error);
        }

        postDataImg(apiEndPoint, formData).then((res)=>{
            fetchDataFromAPI("/api/imageUpload").then((response)=>{
                if(response!==undefined && response!==null && response!== "" && response.length!== 0){
                    response.length!==0 && response.map((item)=>{
                        item?.images.length !==0 && item?.images?.map((img)=>{
                            img_arr.push(img);
                        })
                    })

                    uniqueArray = img_arr.filter((item,index)=> img_arr.indexOf(item)===index);
                    const appendedArray = [...previews,...uniqueArray];
                    setPreviews(uniqueArray);
                    setTimeout(()=>{
                        setUploading(false);
                        img_arr= [];
                        context.setAlertBox({
                            open: true,
                            error: false,
                            msg: 'Image uploaded successfully!'
                        })
                    },200);
                }
            })
        });
    }
    const editUser=(e)=>{
        e.preventDefault();
        const appendedArray = [...previews,...uniqueArray];
        img_arr = [];
        formData.append('name',formFields.name);
        formData.append('email',formFields.email);
        formData.append('phone',formFields.phone);
        formData.append('images',appendedArray);
        formFields.images = appendedArray;
        const user = JSON.parse(localStorage.getItem("user"));
        if(formFields.name!=="" && formFields.email!=="" && formFields.phone!=="" && previews.length!==0) {
            setIsLoading(true);
              editData(`/api/user/${user?.userId}`, formFields).then((res)=>{               
                setIsLoading(false);
                deleteData("/api/imageUpload/deleteAllImages");
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: 'User updated successfully!'
                })
               })
            
        }
       else{
        context.setAlertBox({
            open:true,
            error:true,
            msg:'Please fill all the details'
        })
        // return false;

       }
    }

    const changePassword=(e)=>{
        e.preventDefault();
        formData.append('password',fields.password);

        if(fields.oldPassword!=="" && fields.password!=="" && fields.confirmPassword!=="") {
            if(fields.password!== fields.confirmPassword){
                context.setAlertBox({
                    open: true,
                    error: true,
                    msg: 'Password and confirm password not match!'
                })
            }else{
                const user = JSON.parse(localStorage.getItem("user"));
                const data ={
                    name: user?.name,
                    email: user?.email,
                    phone: formFields.phone,
                    password: fields.oldPassword,
                    newPass: fields.password,
                    images: formFields.images
                }
               editData(`/api/user/changePassword/${user?.userId}`,data).then((res)=>{
                    context.setAlertBox({
                        open: true,
                        error: false,
                        msg: 'Password change successfully!'
                    })
                
               })
            }
           
        }else{
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Please fill all the details!'
            })
           
        }
    }
    return(
        <section className="section myAccountPage">
            <div className="container">
                <h2 className="hd"> My Account</h2>
                <Box sx={{ width: '100%' }} className="myAccBox card border-0">
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Edit Profile" {...a11yProps(0)} />
                        <Tab label="Change Password" {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <form onSubmit={editUser}>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="userImage">
                                    {
                                        previews?.length!==0 ? previews?.map((img, index)=>{
                                            return (
                                                        <img src={img} key={index} className='w-100' alt=''/>
                                                
                                            )
                                        })
                                        :
                                        <img src={NoUserImg} alt=""/>
                                      }
                                        <div className="overlay d-flex align-items-center justify-content-center">
                                            <IoMdCloudUpload/>
                                            <input type='file' multiple onChange={(e) => onChangeFile(e, '/api/user/upload')} name='images'/>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-8">
                                    <div className="row">
                                       <div className="col-md-6">
                                            <div className="form-group">
                                                <TextField  label="Name" variant="outlined" className="w-100" name="name" onChange={changeInput} value={formFields.name}/>   
                                            </div>
                                       </div>
                                       <div className="col-md-6">
                                            <div className="form-group">
                                                <TextField  label="Email" disabled variant="outlined"  className="w-100" name="email" onChange={changeInput} value={formFields.email}/>   
                                            </div>
                                       </div>
                                       <div className="col-md-6">
                                            <div className="form-group">
                                                <TextField  label="Phone" variant="outlined" className="w-100" name="phone" onChange={changeInput} value={formFields.phone}/>   
                                            </div>
                                       </div>
                                       
                                    </div>
                                    <div className="form-group">
                                        <Button type="submit" className="btn-blue bg-red btn-lg btn-big">Save</Button>
                                    </div>
                                </div>
                                           
                                      
                            </div>
                        </form>
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                    <form onSubmit={changePassword}>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="row">
                                       <div className="col-md-4">
                                            <div className="form-group">
                                                <TextField  label="Old Password" variant="outlined" className="w-100" name="oldPassword" onChange={changeInput2}/>   
                                            </div>
                                       </div>
                                       <div className="col-md-4">
                                            <div className="form-group">
                                                <TextField  label="New Password" variant="outlined"  className="w-100" name="password" onChange={changeInput2}/>   
                                            </div>
                                       </div>
                                       <div className="col-md-4">
                                            <div className="form-group">
                                                <TextField  label="Confirm Password" variant="outlined" className="w-100" name="confirmPassword" onChange={changeInput2}/>   
                                            </div>
                                       </div>
                                       
                                    </div>
                                    <div className="form-group">
                                        <Button type="submit" className="btn-blue bg-red btn-lg btn-big">Save</Button>
                                    </div>
                                </div>
                                           
                                      
                            </div>
                        </form>
                    </CustomTabPanel>
                </Box>
            </div>
        </section>
    )
}

export default MyAccount;