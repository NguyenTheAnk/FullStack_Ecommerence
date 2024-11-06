import { useContext, useEffect, useState } from 'react';
import Logo from '../../assets/images/logo1.png';
import { MyContext } from '../../App';
import patern from '../../assets/images/background-admin.webp';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import gogle from '../../assets/images/google.png';
import { postData } from '../../utils/api';
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import CircularProgress from '@mui/material/CircularProgress';
const Login = () => {

    const [inputIndex, setInputIndex] = useState(null);
    const [isShowPassword, setisShowPassword] = useState(false);
    const context = useContext(MyContext);
    const [isLoading,setIsLoading] = useState(false);
    const [formFields, setFormFields] = useState({
        email: "",
        password: "",
        isAdmin: true
    });
    const history = useNavigate();
    useEffect(() => {
        context.setIsHideSidebarAndHeader(true);
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
    const signIn=(e)=>{
        e.preventDefault();
        if(formFields.email ===""){
            context.setAlertBox({
                open:true,
                error:true,
                msg:'Email can not be blank!'
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
        setIsLoading(true);
        postData("/api/user/signIn", formFields).then((res)=>{
            try{
                if(res.error!== true){
                    localStorage.setItem("token", res.token);
                    const user ={
                        name: res.user?.name,
                        email: res.user?.email,
                        userId: res.user?.id
                    }
                    localStorage.setItem("user", JSON.stringify(user));
                    
                    context.setAlertBox({
                        open:true,
                        error:false,
                        msg:'User Login Successfully!'
                    })
                   
                    setTimeout(()=>{
                        // history("/dashboard");
                        setIsLoading(false);
                        window.location.href="/dashboard";
                    }, 2000);
                }
                else{
                    context.setAlertBox({
                        open:true,
                        error:true,
                        msg:res.msg
                    })
                    console.log(res.msg);
                    setIsLoading(false);
                }
            }catch(err){
                console.log(err);
                setIsLoading(false);
            }
        })
    }
    return (
        <>
        <img src={patern} className='loginPatern' alt=''/>
            <section className="loginSection">
                <div className="loginBox">
                    <div className='logo text-center'>
                        <img src={Logo} alt='' width={"60px"}/>
                        <h5 className='font-weight-bold'>Login to Ecommerence</h5>
                    </div>

                    <div className='wrapper mt-3 card border'>
                        <form onSubmit={signIn}>
                            <div className={`form-group position-relative ${inputIndex ===0 && 'focus'}`}>
                                <span className='icon'><MdEmail/></span>
                                <input type='text' className='form-control' placeholder='Enter your email' onFocus={()=> focusInput(0)} 
                                onBlur={()=> setInputIndex(null)} autoFocus name="email" onChange={onchangeInput}/>
                            </div>
                            <div className={`form-group position-relative ${inputIndex ===1 && 'focus'}`}>
                                <span className='icon'><RiLockPasswordFill/></span>
                                <input type={`${isShowPassword === true ? 'text' : 'password'}`} className='form-control' placeholder='Enter your password' onFocus={()=> focusInput(1)} onBlur={()=> setInputIndex(null)} name="password" onChange={onchangeInput}/>
                                <span className='toggleShowPassword' onClick={()=> setisShowPassword(!isShowPassword)}>
                                    {
                                        isShowPassword === true ? <IoMdEye/> : <IoMdEyeOff/>
                                    }
                                </span>
                            </div>
                            <div className='form-group'>
                                    <Button type='submit' className='btn-blue btn-lg w-100 btn-big'>
                                    {
                                                    isLoading===true ?  <CircularProgress/> :'Sign In'
                                                }
                                    </Button>
                            </div>
                            <div className='form-group text-center mb-0'>
                                <Link to={'/forgot-password'} className='link '>FORGOT PASSWORD</Link>
                                <div className='d-flex align-items-center justify-content-center or mt-3 mb-3'>
                                    <span className='line'></span>
                                    <span className='txt'>or</span>
                                    <span className='line'></span>
                                </div>

                                <Button variant="outlined"  className='w-100 btn-lg btn-big loginWithGoogle'><img src={gogle} alt='' width="25px"/>&nbsp; Sign In with Google</Button>
                            </div>
                            
                        </form>
                    </div>

                    <div className='wrapper mt-3 card border footer p-3'>
                        <span className='text-center'>
                            Don't have an account?
                            <Link to={'/signUp'} className='link color ml-2'>Register</Link>
                        </span>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Login;