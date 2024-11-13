// import React, { useContext, useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import PropTypes from 'prop-types';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';
// import Box from '@mui/material/Box';
// import { IoMdCloudUpload } from "react-icons/io";
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import { deleteData, deleteImages, editData, fetchDataFromAPI } from "../../utils/api";
// import { MyContext } from '../../App';
// import { postDataImg } from "../../../../client/src/utils/api";
// import NoUserImg  from '../../assets/images/no-user.jpg'
// function CustomTabPanel(props) {
//     const { children, value, index, ...other } = props;
  
//     return (
//       <div
//         role="tabpanel"
//         hidden={value !== index}
//         id={`simple-tabpanel-${index}`}
//         aria-labelledby={`simple-tab-${index}`}
//         {...other}
//       >
//         {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
//       </div>
//     );
//   }
  
//   CustomTabPanel.propTypes = {
//     children: PropTypes.node,
//     index: PropTypes.number.isRequired,
//     value: PropTypes.number.isRequired,
//   };
  
//   function a11yProps(index) {
//     return {
//       id: `simple-tab-${index}`,
//       'aria-controls': `simple-tabpanel-${index}`,
//     };
//   }
  

// const MyAccount = ()=>{
//     const [isLogin, setIsLogin] = useState(false);
//     const history = useNavigate();
//     const [value, setValue] = React.useState(0);
//     const [isLoading,setIsLoading] = useState(false);
//     const [uploading,setUploading] = useState(false);
//     const [previews, setPreviews] = useState([]);
//     const [userData, setUserData] = useState([]);
//     const formData = new FormData();
//     const context = useContext(MyContext);
//     const [formFields, setFormFields] = useState({
//         name: '',
//         email: '',
//         phone: '',
//         images: [],
//     });
//     const [fields, setFields] = useState({
//         oldPassword: '',
//         password: '',
//         confirmPassword: '',
//     });
//     const handleChange = (event, newValue) => {
//         setValue(newValue);
//     };
//     const changeInput= (e) => {
//         setFormFields(()=> (
//             {
//                 ...formFields,
//                 [e.target.name]: e.target.value
//             }
//         ))
//     };
//     const changeInput2= (e) => {
//         setFields(()=> (
//             {
//                 ...fields,
//                 [e.target.name]: e.target.value
//             }
//         ))
//     };
//     let img_arr= [];
//     let uniqueArray=[];
//     useEffect(()=>{
//         window.scrollTo(0,0);

//         const token = localStorage.getItem("token");
//         if(token!==null && token!==undefined && token!==""){
//           setIsLogin(true);
//         }else{
//          history("/signIn");
//         }    
        
        
//         deleteData("/api/imageUpload/deleteAllImages");
//         const user = JSON.parse(localStorage.getItem("user"));
//         fetchDataFromAPI(`/api/user/${user?.userId}`).then((res)=>{
//             setUserData(res);
//             setPreviews(res.images);
//             setFormFields({
//                 name: res.name,
//                 email: res.email,
//                 phone: res.phone,
//             });                   
//         });
//       },[]);
//       const onChangeFile= async(e, apiEndPoint)=>{
//         try{
//             setPreviews([]);
//             // const imgArr = [];
//             const files = e.target.files;
//             setUploading(true);
//             // setImgFiles(e.target.files);
//             for(var i=0; i < files.length; i++){
                
//                 if(files[i] && (files[i].type=== 'image/jpeg' || files[i].type==='image/jpg' || files[i].type==='image/png' || files[i].type==='image/webp')){
//                     // setImgFiles(e.target.files);
//                     const file = files[i];
//                     formData.append(`images`, file);
//                 }
//                 else{
//                     context.setAlertBox({
//                         open: true,
//                         error: true,
//                         msg: 'Please select a valid JPG or PNG image file!'
//                 })
//             }
//         }
//         }catch(error){
//             console.log(error);
//         }

//         postDataImg(apiEndPoint, formData).then((res)=>{
//             fetchDataFromAPI("/api/imageUpload").then((response)=>{
//                 if(response!==undefined && response!==null && response!== "" && response.length!== 0){
//                     response.length!==0 && response.map((item)=>{
//                         item?.images.length !==0 && item?.images?.map((img)=>{
//                             img_arr.push(img);
//                         })
//                     })

//                     uniqueArray = img_arr.filter((item,index)=> img_arr.indexOf(item)===index);
//                     const appendedArray = [...previews,...uniqueArray];
//                     setPreviews(uniqueArray);
//                     setTimeout(()=>{
//                         setUploading(false);
//                         img_arr= [];
//                         context.setAlertBox({
//                             open: true,
//                             error: false,
//                             msg: 'Image uploaded successfully!'
//                         })
//                     },200);
//                 }
//             })
//         });
//     }
//     const editUser=(e)=>{
//         e.preventDefault();
//         const appendedArray = [...previews,...uniqueArray];
//         img_arr = [];
//         formData.append('name',formFields.name);
//         formData.append('email',formFields.email);
//         formData.append('phone',formFields.phone);
//         formData.append('images',appendedArray);
//         formFields.images = appendedArray;
//         const user = JSON.parse(localStorage.getItem("user"));
//         if(formFields.name!=="" && formFields.email!=="" && formFields.phone!=="" && previews.length!==0) {
//             setIsLoading(true);
//               editData(`/api/user/${user?.userId}`, formFields).then((res)=>{               
//                 setIsLoading(false);
//                 deleteData("/api/imageUpload/deleteAllImages");
//                 context.setAlertBox({
//                     open: true,
//                     error: false,
//                     msg: 'User updated successfully!'
//                 })
//                })
            
//         }
//        else{
//         context.setAlertBox({
//             open:true,
//             error:true,
//             msg:'Please fill all the details'
//         })
//         // return false;

//        }
//     }

//     const changePassword=(e)=>{
//         e.preventDefault();
//         formData.append('password',fields.password);

//         if(fields.oldPassword!=="" && fields.password!=="" && fields.confirmPassword!=="") {
//             if(fields.password!== fields.confirmPassword){
//                 context.setAlertBox({
//                     open: true,
//                     error: true,
//                     msg: 'Password and confirm password not match!'
//                 })
//             }else{
//                 const user = JSON.parse(localStorage.getItem("user"));
//                 const data ={
//                     name: user?.name,
//                     email: user?.email,
//                     phone: formFields.phone,
//                     password: fields.oldPassword,
//                     newPass: fields.password,
//                     images: formFields.images
//                 }
//                editData(`/api/user/changePassword/${user?.userId}`,data).then((res)=>{
//                     context.setAlertBox({
//                         open: true,
//                         error: false,
//                         msg: 'Password change successfully!'
//                     })
                
//                })
//             }
           
//         }else{
//             context.setAlertBox({
//                 open: true,
//                 error: true,
//                 msg: 'Please fill all the details!'
//             })
           
//         }
//     }
//     return(
//         <section className="section myAccountPage">
//             <div className="container">
//                 <h2 className="hd"> My Account</h2>
//                 <Box sx={{ width: '100%' }} className="myAccBox card border-0">
//                     <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
//                         <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
//                         <Tab label="Edit Profile" {...a11yProps(0)} />
//                         <Tab label="Change Password" {...a11yProps(1)} />
//                         </Tabs>
//                     </Box>
//                     <CustomTabPanel value={value} index={0}>
//                         <form onSubmit={editUser}>
//                             <div className="row">
//                                 <div className="col-md-4">
//                                     <div className="userImage">
//                                     {
//                                         previews?.length!==0 ? previews?.map((img, index)=>{
//                                             return (
//                                                         <img src={img} key={index} className='w-100' alt=''/>
                                                
//                                             )
//                                         })
//                                         :
//                                         <img src={NoUserImg} alt=""/>
//                                       }
//                                         <div className="overlay d-flex align-items-center justify-content-center">
//                                             <IoMdCloudUpload/>
//                                             <input type='file' multiple onChange={(e) => onChangeFile(e, '/api/user/upload')} name='images'/>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="col-md-8">
//                                     <div className="row">
//                                        <div className="col-md-6">
//                                             <div className="form-group">
//                                                 <TextField  label="Name" variant="outlined" className="w-100" name="name" onChange={changeInput} value={formFields.name}/>   
//                                             </div>
//                                        </div>
//                                        <div className="col-md-6">
//                                             <div className="form-group">
//                                                 <TextField  label="Email" disabled variant="outlined"  className="w-100" name="email" onChange={changeInput} value={formFields.email}/>   
//                                             </div>
//                                        </div>
//                                        <div className="col-md-6">
//                                             <div className="form-group">
//                                                 <TextField  label="Phone" variant="outlined" className="w-100" name="phone" onChange={changeInput} value={formFields.phone}/>   
//                                             </div>
//                                        </div>
                                       
//                                     </div>
//                                     <div className="form-group">
//                                         <Button type="submit" className="btn-blue bg-red btn-lg btn-big">Save</Button>
//                                     </div>
//                                 </div>
                                           
                                      
//                             </div>
//                         </form>
//                     </CustomTabPanel>
//                     <CustomTabPanel value={value} index={1}>
//                     <form onSubmit={changePassword}>
//                             <div className="row">
//                                 <div className="col-md-12">
//                                     <div className="row">
//                                        <div className="col-md-4">
//                                             <div className="form-group">
//                                                 <TextField  label="Old Password" variant="outlined" className="w-100" name="oldPassword" onChange={changeInput2}/>   
//                                             </div>
//                                        </div>
//                                        <div className="col-md-4">
//                                             <div className="form-group">
//                                                 <TextField  label="New Password" variant="outlined"  className="w-100" name="password" onChange={changeInput2}/>   
//                                             </div>
//                                        </div>
//                                        <div className="col-md-4">
//                                             <div className="form-group">
//                                                 <TextField  label="Confirm Password" variant="outlined" className="w-100" name="confirmPassword" onChange={changeInput2}/>   
//                                             </div>
//                                        </div>
                                       
//                                     </div>
//                                     <div className="form-group">
//                                         <Button type="submit" className="btn-blue bg-red btn-lg btn-big">Save</Button>
//                                     </div>
//                                 </div>
                                           
                                      
//                             </div>
//                         </form>
//                     </CustomTabPanel>
//                 </Box>
//             </div>
//         </section>
//     )
// }

// export default MyAccount;

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdCloudUpload } from "react-icons/io";
import { 
    TextField, 
    Button, 
    Box,
    Tabs,
    Tab,
    CircularProgress,
    IconButton,
    InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { deleteData, editData, fetchDataFromAPI } from "../../utils/api";
import { MyContext } from '../../App';
import { postDataImg } from "../../utils/api";
import NoUserImg from '../../assets/images/no-user.jpg';

// CustomTabPanel component remains the same
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

const MyAccount = () => {
    const navigate = useNavigate();
    const context = useContext(MyContext);
    
    // States
    const [value, setValue] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [previews, setPreviews] = useState([]);
    const [userData, setUserData] = useState(null);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({
        oldPassword: '',
        password: '',
        confirmPassword: ''
    });

    // Form states
    const [formFields, setFormFields] = useState({
        name: '',
        email: '',
        phone: '',
        images: [],
    });
    const [passwordFields, setPasswordFields] = useState({
        oldPassword: '',   
        newPassword: '',   
        confirmPassword: ''
      });

    // Password validation
    const validatePassword = (password) => {
        if (password.length < 8) {
            return "Password must be at least 8 characters long";
        }
        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter";
        }
        if (!/[a-z]/.test(password)) {
            return "Password must contain at least one lowercase letter";
        }
        if (!/[0-9]/.test(password)) {
            return "Password must contain at least one number";
        }
        return "";
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        const token = localStorage.getItem("token");
        
        if (!token) {
            navigate("/signIn");
            return;
        }

        loadUserData();
    }, [navigate]);

    const loadUserData = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user?.userId) {
                throw new Error("User ID not found");
            }

            await deleteData("/api/imageUpload/deleteAllImages");
            const userData = await fetchDataFromAPI(`/api/user/${user.userId}`);
            
            setUserData(userData);
            setPreviews(userData.images || []);
            setFormFields({
                name: userData.name || '',
                email: userData.email || '',
                phone: userData.phone || '',
                images: userData.images || [],
            });
        } catch (error) {
            console.error("Error loading user data:", error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Failed to load user data'
            });
        }
    };

    const handlePasswordChange = (field) => (e) => {
        const value = e.target.value;
        setPasswordFields(prev => ({
            ...prev,
            [field]: value
        }));

        if (field === 'oldPassword') {
            // Xóa lỗi khi người dùng bắt đầu nhập
            setErrors(prev => ({
                ...prev,
                oldPassword: value ? '' : 'Current password is required'
            }));
        }
        else if (field === 'newPassword') {
            const error = validatePassword(value);
            setErrors(prev => ({
                ...prev,
                newPassword: error
            }));
            
            // Kiểm tra confirmPassword nếu đã được nhập
            if (passwordFields.confirmPassword) {
                setErrors(prev => ({
                    ...prev,
                    confirmPassword: value !== passwordFields.confirmPassword ? "Passwords don't match" : ""
                }));
            }
            if (value === passwordFields.oldPassword) {
                setErrors(prev => ({
                    ...prev,
                    newPassword: "New password must be different from current password"
                }));
            }
        } 
        else if (field === 'confirmPassword') {
            setErrors(prev => ({
                ...prev,
                confirmPassword: value !== passwordFields.newPassword ? "Passwords don't match" : ""
            }));
        }


    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormFields(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = async (e) => {
        try {
            setPreviews([]);
            const files = e.target.files;
            if (!files.length) return;

            setUploading(true);
            const formData = new FormData();
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
                    throw new Error('Invalid file type');
                }
                formData.append('images', file);
            }

            const response = await postDataImg('/api/user/upload', formData);
            const imageData = await fetchDataFromAPI("/api/imageUpload");
            
            if (imageData?.length) {
                const newImages = imageData.flatMap(item => item.images || []);
                setPreviews(newImages);
                
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: 'Images uploaded successfully!'
                });
            }
        } catch (error) {
            console.error("Upload error:", error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: error.message || 'Failed to upload images'
            });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmitProfile = async (e) => {
        e.preventDefault();
        
        try {
            setIsLoading(true);
            
            if (!formFields.name || !formFields.email || !formFields.phone) {
                throw new Error('Please fill all required fields');
            }

            const user = JSON.parse(localStorage.getItem("user"));
            if (!user?.userId) {
                throw new Error('User session expired');
            }

            const updatedData = {
                ...formFields,
                images: previews
            };

            await editData(`/api/user/${user.userId}`, updatedData);
            await deleteData("/api/imageUpload/deleteAllImages");
            
            context.setAlertBox({
                open: true,
                error: false,
                msg: 'Profile updated successfully!'
            });

            // Refresh user data
            loadUserData();

        } catch (error) {
            console.error("Profile update error:", error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: error.message || 'Failed to update profile'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // const handlePasswordUpdate = async (e) => {
    //     e.preventDefault();
        
    //     try {
    //         setIsLoading(true);

    //         // Validate all fields
    //         if (Object.values(passwordFields).some(field => !field)) {
    //             throw new Error('Please fill all password fields');
    //         }

    //         if (Object.values(errors).some(error => error)) {
    //             throw new Error('Please fix password validation errors');
    //         }

    //         const user = JSON.parse(localStorage.getItem("user"));
    //         if (!user?.userId) {
    //             throw new Error('User session expired');
    //         }

    //         const updateData = {
    //             name: user.name,
    //             email: user.email,
    //             phone: formFields.phone,
    //             password: passwordFields.password,
    //             newPass: passwordFields.newPass,
    //             images: userData?.images || []
    //         };

    //         const response = await editData(`/api/user/changePassword/${user.userId}`, updateData);
    //         console.log(updateData);
    //         if (response.error) {
    //             throw new Error(response.msg || 'Password change failed');
    //         }

    //         context.setAlertBox({
    //             open: true,
    //             error: false,
    //             msg: 'Password changed successfully!'
    //         });

    //         // Reset password fields
    //         setPasswordFields({
    //             oldPassword: '',
    //             password: '',
    //             confirmPassword: ''
    //         });

    //     } catch (error) {
    //         console.error("Password change error:", error);
    //         context.setAlertBox({
    //             open: true,
    //             error: true,
    //             msg: error.message || 'Failed to change password'
    //         });
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        
        try {
            setIsLoading(true);
    
            // Validate tất cả các trường
            const validationErrors = {};
            if (!passwordFields.oldPassword) {
                validationErrors.oldPassword = 'Current password is required';
            }
            if (!passwordFields.newPassword) {
                validationErrors.newPassword = 'New password is required';
            }
            if (!passwordFields.confirmPassword) {
                validationErrors.confirmPassword = 'Confirm password is required';
            }
            if (passwordFields.newPassword === passwordFields.oldPassword) {
                validationErrors.newPassword = 'New password must be different from current password';
            }
            
            // Kiểm tra password validation
            const newPasswordError = validatePassword(passwordFields.newPassword);
            if (newPasswordError) {
                validationErrors.newPassword = newPasswordError;
            }
    
            // Kiểm tra confirm password
            if (passwordFields.newPassword !== passwordFields.confirmPassword) {
                validationErrors.confirmPassword = "Passwords don't match";
            }
    
            // Nếu có lỗi validation, hiển thị và dừng
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                throw new Error('Please fix all errors before submitting');
            }
    
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user?.userId) {
                throw new Error('User session expired');
            }
    
            const updateData = {
                name: formFields.name || user.name,
                email: formFields.email || user.email,
                phone: formFields.phone,
                password: passwordFields.oldPassword,
                newPass: passwordFields.newPassword,
                images: userData?.images || []
            };
    
            const response = await editData(`/api/user/changePassword/${user.userId}`, updateData);
            
            if (response.error) {
                // Xử lý lỗi từ server
                setErrors(prev => ({
                    ...prev,
                    oldPassword: response.msg // Hiển thị thông báo lỗi từ server về mật khẩu hiện tại
                }));
                throw new Error(response.msg);
            }
    
            // Reset form và hiển thị thông báo thành công
            setPasswordFields({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setErrors({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
    
            context.setAlertBox({
                open: true,
                error: false,
                msg: 'Password changed successfully!'
            });
    
        } catch (error) {
            console.error("Password change error:", error);
            context.setAlertBox({
                open: true,
                error: true,
                msg: error.message || 'Failed to change password'
            });
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <section className="section myAccountPage">
            <div className="container">
                <h2 className="hd">My Account</h2>
                <Box sx={{ width: '100%' }} className="myAccBox card border-0">
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={(e, newValue) => setValue(newValue)}>
                            <Tab label="Edit Profile" />
                            <Tab label="Change Password" />
                        </Tabs>
                    </Box>

                    <CustomTabPanel value={value} index={0}>
                        <form onSubmit={handleSubmitProfile}>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="userImage position-relative">                                      
                                        {previews?.length ? (
                                            previews.map((img, index) => (
                                                <img key={index} src={img} className="w-100" alt="User" />
                                            ))
                                        ) : (
                                            <img src={NoUserImg} alt="Default User" />
                                        )}
                                        <div className="overlay d-flex align-items-center justify-content-center">
                                            <IoMdCloudUpload />
                                            <input
                                                type="file"
                                                multiple
                                                onChange={handleImageUpload}
                                                disabled={uploading}
                                                accept="image/*"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-8">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <TextField
                                                fullWidth
                                                label="Name"
                                                name="name"
                                                value={formFields.name}
                                                onChange={handleFormChange}
                                                margin="normal"
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <TextField
                                                fullWidth
                                                label="Email"
                                                name="email"
                                                value={formFields.email}
                                                onChange={handleFormChange}
                                                margin="normal"
                                                disabled
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <TextField
                                                fullWidth
                                                label="Phone"
                                                name="phone"
                                                value={formFields.phone}
                                                onChange={handleFormChange}
                                                margin="normal"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={isLoading}
                                            className="btn-blue bg-red btn-lg"
                                        >
                                            {isLoading ? <CircularProgress size={24} /> : 'Save Changes'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CustomTabPanel>

                    <CustomTabPanel value={value} index={1}>
                        <form onSubmit={handlePasswordUpdate}>
                            <div className="row justify-content-center">
                                <div className="col-md-8">
                                    <TextField
                                        fullWidth
                                        label="Current Password"
                                        name="oldPassword"
                                        type={showOldPassword ? 'text' : 'password'}
                                        value={passwordFields.oldPassword}
                                        onChange={handlePasswordChange('oldPassword')}
                                        margin="normal"
                                        required
                                        error={Boolean(errors.oldPassword)} 
                                        helperText={errors.oldPassword}    // Sẽ hiển thị lỗi từ server khi mật khẩu không đúng
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                                        edge="end"
                                                    >
                                                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="New Password"
                                        name="newPassword"
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={passwordFields.newPassword}
                                        onChange={handlePasswordChange('newPassword')}
                                        margin="normal"
                                        required
                                        error={!!errors.newPassword}
                                        helperText={errors.newPassword}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        edge="end"
                                                    >
                                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Confirm New Password"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={passwordFields.confirmPassword}
                                        onChange={handlePasswordChange('confirmPassword')}
                                        margin="normal"
                                        required
                                        error={!!errors.confirmPassword}
                                        helperText={errors.confirmPassword}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                                                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                                                                                edge="end"
                                                                                                            >
                                                                                                                {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                                                                            </IconButton>
                                                                                                        </InputAdornment>
                                                                                                    ),
                                                                                                }}
                                                                                            />                                                      
                                                        
                                                                                            <div className="mt-4">
                                                                                                <Button
                                                                                                    type="submit"
                                                                                                    variant="contained"
                                                                                                    color="primary"
                                                                                                    disabled={isLoading}
                                                                                                    className="btn-blue bg-red btn-lg"
                                                                                                >
                                                                                                    {isLoading ? <CircularProgress size={24} /> : 'Update Password'}
                                                                                                </Button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </form>
                                                                            </CustomTabPanel>
                                                                        </Box>
                                                                    </div>
                                                                </section>
                                                            );
                                                        };
                                                        
                                                        export default MyAccount;
                                                        