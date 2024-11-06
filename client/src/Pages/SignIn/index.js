import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import Logo from '../../assets/images/logo.png';
import TextField from '@mui/material/TextField';
import  Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import GoogleImg from '../../assets/images/google1.png';
import { postData } from "../../utils/api";
const SignIn = () => {

    const context = useContext(MyContext);
    const [isLoading,setIsLoading] = useState(false);
    const history = useNavigate();
    const [formFields, setFormFields] = useState({
        email: "",
        password: ""
    });
    const onchangeInput=(e)=>{
        setFormFields(()=> ({
            ...formFields, 
            [e.target.name]: e.target.value
        }))
    }
    useEffect(()=>{
        context.setisHeaderFooterShow(false);
    }, []);
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
                        window.location.href="/";
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
        <section className="section signInPage">
            <div className="shape-bottom"> <svg fill="#fff" id="Layer_1" x="0px" y="0px" viewBox="0 0 1921 819.8"> <path class="st0" d="M1921,413.1v406.7H0V0.5h0.4l228.1,598.3c30,74.4,80.8,130.6,152.5,168.6c107.6,57,212.1,40.7,245.7,34.4 c22.4-4.2,54.9-13.1,97.5-26.6L1921,400.5V413.1z"></path> </svg></div>
            <div className="container">
                <div className="box card p-3 shadow border-0">
                    <div className="text-center logoWrapper d-flex justify-content-center align-items-center">
                        <img src={Logo} alt="" style={{ width: '150px', height: 'auto', textAlign: 'center' }} />
                    </div>

                    

                    <form className="mt-3" onSubmit={signIn}>
                        <h2 className="mb-4">Sign In</h2>
                        <div className="form-group">
                            <TextField id="standard-basic" label="Email" required type="email" variant="standard" className="w-100" name="email" onChange={onchangeInput}/>   
                        </div>
                        <div className="form-group">
                            <TextField id="standard-basic" label="Password" required type="password" variant="standard" className="w-100" name="password" onChange={onchangeInput}/>   
                        </div>


                        <a className="border-effect cursor">Forgot Password?</a>
                        
                        <div className="d-flex align-items-center mt-3 mb-3">
                            <Button type="submit" className="btn-blue col btn-lg btn-big">
                                {
                                    isLoading ===true ? <CircularProgress/> : 'Sign In'
                                }
                            </Button>
                            <Link to="/" className="d-block col"> <Button className="btn-lg btn-big col ml-3" variant="outlined" onClick={() => context.setisHeaderFooterShow(true)}>Cancel</Button></Link>
                           
                        </div>

                        <p className="txt">Not Registered? <Link to="/signUp" className="border-effect">Sign Up</Link></p>

                        <h6 className="mt-4 text-center font-weight-bold">Or continue with social account</h6>

                        <Button className="loginWithGoogle mt-2" variant="outlined"><img src={GoogleImg}/>Sign In With Google</Button>

                    </form>
                </div>
            </div>
        </section>
    )
}

export default SignIn;