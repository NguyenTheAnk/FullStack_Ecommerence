import { useContext, useEffect, useState } from 'react';
import Logo from '../../assets/images/logo1.png';
import { MyContext } from '../../App';
import patern from '../../assets/images/background-admin.webp';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import gogle from '../../assets/images/google.png';
import { FaUserCircle } from "react-icons/fa";
import { IoShieldCheckmark } from "react-icons/io5";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { FaHome } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import { postData } from '../../utils/api';
import CircularProgress from '@mui/material/CircularProgress';
const SignUp = () => {
    const [inputIndex, setInputIndex] = useState(null);
    const [isLoading,setIsLoading] = useState(false);
    const [isShowPassword, setisShowPassword] = useState(false);
    const [isShowConfirmPassword, setisShowConfirmPassword] = useState(false);
    const [formFields, setFormFields] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        isAdmin: true
    });
    const history = useNavigate();
    const context = useContext(MyContext);
    useEffect(() => {
        context.setIsHideSidebarAndHeader(true);
        window.scrollTo(0, 0);
    }, []);
    const focusInput = (index) =>{
        setInputIndex(index);
    }
    const onchangeInput=(e)=>{
        setFormFields(()=> ({
            ...formFields, 
            [e.target.name]: e.target.value
        }))
    }
    const signUp=(e)=>{
        e.preventDefault();
       
       try{
        if(formFields.name ===""){
            context.setAlertBox({
                open:true,
                error:true,
                msg:'Name can not be blank!'
            })
            return false;
        }
        if(formFields.email ===""){
            context.setAlertBox({
                open:true,
                error:true,
                msg:'Email can not be blank!'
            })
            return false;
        }
        if(formFields.phone ===""){
            context.setAlertBox({
                open:true,
                error:true,
                msg:'Please add phone!'
            })
            return false;
        }
        if(formFields.password ===""){
            context.setAlertBox({
                open:true,
                error:true,
                msg:'Password can not be blank!'
            })
            return false;
        }
        if(formFields.confirmPassword ===""){
            context.setAlertBox({
                open:true,
                error:true,
                msg:'Confirm Password can not be blank!'
            })
            return false;
        }
        if(formFields.confirmPassword !== formFields.password){
            context.setAlertBox({
                open:true,
                error:true,
                msg:'Password not match!'
            })
            return false;
        }
        setIsLoading(true);
        postData("/api/user/signup", formFields).then((res)=>{
            if(res.error !== true){
                context.setAlertBox({
                    open:true,
                    error:false,
                    msg:'Register Successfully!'
                })
                setIsLoading(true);
                setTimeout(()=>{
                    history("/login");
                }, 2000);
            }else{
                context.setAlertBox({
                    open:true,
                    error:true,
                    msg:res.msg
                })
            }
            
        })
       }catch(error){
        console.log(error);
       }
    }
    return (
        <>
        <img src={patern} className='loginPatern' alt=''/>
            <section className="loginSection signUpSection">
                <div className='row'>
                    <div className='col-md-8 d-flex align-items-center flex-column part1 justify-content-center'>
                        <h1>BEST UX/UI FASHION <span className='text-sky'> ECOMMERCE DASHBOARD </span> & ADMIN PANEL</h1>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                            when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                            It has survived not only five centuries</p>

                            <div className='w-100'>
                                <Link to={'/'}><Button className='btn-blue btn-lg btn-big'><FaHome/> &nbsp;Go to home</Button></Link>
                            </div>
                    </div>
                    <div className='col-md-4 pr-0'>
                        <div className="loginBox">
                            <div className='logo text-center'>
                                <img src={Logo} alt='' width={"60px"}/>
                                <h5 className='font-weight-bold'>Register a new account</h5>
                            </div>

                            <div className='wrapper mt-3 card border'>
                                <form onSubmit={signUp}>
                                    <div className={`form-group position-relative ${inputIndex ===0 && 'focus'}`}>
                                        <span className='icon'><FaUserCircle/></span>
                                        <input type='text' className='form-control' placeholder='Enter your name' onFocus={()=> focusInput(0)}
                                         onBlur={()=> setInputIndex(null)} autoFocus name="name" onChange={onchangeInput}/>
                                    </div>
                                    <div className={`form-group position-relative ${inputIndex ===1 && 'focus'}`}>
                                        <span className='icon'><MdEmail/></span>
                                        <input type='text' className='form-control' placeholder='Enter your email' onFocus={()=> focusInput(1)} onBlur={()=> setInputIndex(null)} name="email" onChange={onchangeInput}/>
                                    </div>
                                    <div className={`form-group position-relative ${inputIndex ===2 && 'focus'}`}>
                                        <span className='icon'><FaPhoneAlt/></span>
                                        <input type="text" className='form-control' placeholder='Enter your phone' onFocus={()=> focusInput(2)} onBlur={()=> setInputIndex(null)} name="phone" onChange={onchangeInput}/>                                     
                                    </div>
                                    <div className={`form-group position-relative ${inputIndex ===3 && 'focus'}`}>
                                        <span className='icon'><RiLockPasswordFill/></span>
                                        <input type={`${isShowPassword === true ? 'text' : 'password'}`} className='form-control' placeholder='Enter your password' onFocus={()=> focusInput(3)} onBlur={()=> setInputIndex(null)} name="password" onChange={onchangeInput}/>
                                        <span className='toggleShowPassword' onClick={()=> setisShowPassword(!isShowPassword)}>
                                            {
                                                isShowPassword === true ? <IoMdEye/> : <IoMdEyeOff/>
                                            }
                                        </span>
                                    </div>
                                    <div className={`form-group position-relative ${inputIndex ===4 && 'focus'}`}>
                                        <span className='icon'><IoShieldCheckmark/></span>
                                        <input type={`${isShowConfirmPassword === true ? 'text' : 'password'}`} className='form-control' placeholder='Confirm your password' onFocus={()=> focusInput(4)} onBlur={()=> setInputIndex(null)} name="confirmPassword" onChange={onchangeInput}/>
                                        <span className='toggleShowPassword' onClick={()=> setisShowConfirmPassword(!isShowConfirmPassword)}>
                                            {
                                                isShowConfirmPassword === true ? <IoMdEye/> : <IoMdEyeOff/>
                                            }
                                        </span>
                                    </div>
                                    <FormControlLabel control={<Checkbox />} label="I agree to the all Terms & Condiotions" />
                                    <div className='form-group'>
                                            <Button type='submit' className='btn-blue btn-lg w-100 btn-big'>
                                                {
                                                    isLoading===true ?  <CircularProgress/> :'Sign Up'
                                                }
                                            </Button>
                                    </div>
                                    <div className='form-group text-center mb-0'>
                                       
                                        <div className='d-flex align-items-center justify-content-center or mt-3 mb-3'>
                                            <span className='line'></span>
                                            <span className='txt'>or</span>
                                            <span className='line'></span>
                                        </div>

                                        <Button variant="outlined"  className='w-100 btn-lg btn-big loginWithGoogle'><img src={gogle} alt='' width="25px"/>&nbsp; Continue with Google</Button>
                                    </div>
                                    
                                </form>
                                <span className='text-center d-block mt-3'>
                                    Don't have an account?
                                    <Link to={'/login'} className='link color ml-2'>Sign In</Link>
                                </span>
                            </div>

                            
                        </div>
                    </div>
                </div>

                
                
            </section>
        </>
    )
}

export default SignUp;