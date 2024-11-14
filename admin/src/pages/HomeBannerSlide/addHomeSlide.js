import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { Chip, emphasize, styled } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import { FaCloudUploadAlt } from "react-icons/fa";
// import { IoCloseSharp } from "react-icons/io5";
// import { FaRegImages } from "react-icons/fa";
// import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useContext, useState, useEffect } from 'react';
import { deleteData, deleteImages, fetchDataFromAPI, postData, uploadImage } from '../../utils/api';
// import OutlinedInput from '@mui/material/OutlinedInput';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';
// import { useSnackbar } from 'notistack';
import { FaRegImages } from "react-icons/fa";
import { IoCloseSharp } from 'react-icons/io5';
const StyleBreadrumb= styled(Chip)(({theme})=>{
    const backgroundColor = theme.palette.mode ==='light' 
    ? theme.palette.grey[100]
    : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor,0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});
const AddHomeSlide= () => {
    const [isLoading,setIsLoading] = useState(false);
    const [uploading,setUploading] = useState(false);
    const context = useContext(MyContext);
    // const { enqueueSnackbar } = useSnackbar();
    const [previews, setPreviews] = useState([]);
    const [imgFiles, setImgFiles] = useState();
    const [formField, setFormField] = useState({
        images: [],
    });
    const formData = new FormData();
    const history =useNavigate();
    const changeInput= (e) => {
        setFormField(()=> (
            {
                ...formField,
                [e.target.name]: e.target.value
            }
        ))
    };

    // useEffect(()=>{
    //     fetchDataFromAPI("/api/imageUpload").then((res)=>{
    //         res?.map((item)=>{
    //             item?.images?.map((img)=>{
    //                 deleteImages(`/api/homeBanner/deleteImage?img=${img}`).then((res)=>{
    //                     deleteData("/api/imageUpload/deleteAllImages");
    //                 })
    //             })
    //         })
    //     })
    // })
    let img_arr= [];
    let uniqueArray=[];
    // let selectedImages=[];
    const removeImg= async(index, imgUrl)=>{
        const imgIndex = previews.indexOf(imgUrl);
        deleteImages(`/api/homeBanner/deleteImage?img=${imgUrl}`).then((res)=>{
            context.setAlertBox({
                open: true,
                error: false,
                msg: 'Image deleted successfully!'
            })
        })
        if(imgIndex >-1){
            previews.splice(index,1);
        }
    }
    const onChangeFile= async(e, apiEndPoint)=>{
        try{
            // const imgArr = [];
            const files = e.target.files;
            setUploading(true);
            // setImgFiles(e.target.files);
            for(var i=0; i < files.length; i++){
                
                if(files[i] && (files[i].type=== 'image/jpeg' || files[i].type==='image/jpg' || files[i].type==='image/png' || files[i].type==='image/webp')){
                    // setImgFiles(e.target.files);
                    const file = files[i];
                    // selectedImages.push(file);
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
        // formField.images = selectedImages;
        }catch(error){
            console.log(error);
        }
        // Đoạn này thay uploadImage cho postData
        uploadImage(apiEndPoint, formData).then((res)=>{
            fetchDataFromAPI("/api/imageUpload").then((response)=>{
                if(response!==undefined && response!==null && response!== "" && response.length!== 0){
                    response.length!==0 && response.map((item)=>{
                        item?.images?.length !==0 && item?.images?.map((img)=>{
                            img_arr.push(img);
                        })
                    })
                // if (response && Array.isArray(response)) {
                //     response.forEach((item) => {
                //         if (item?.images && Array.isArray(item.images)) {
                //             item.images.forEach((img) => {
                //                 img_arr.push(img);
                //             });
                //         }
                //     });

                    uniqueArray = img_arr.filter((item,index)=> img_arr.indexOf(item)===index);
                    const appendedArray = [...previews,...uniqueArray];
                    setPreviews(appendedArray);
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
    const addHomeSlide= (e)=>{
        e.preventDefault();
        const appendedArray = [...previews, ...uniqueArray];
        img_arr = [];
        formData.append('images',appendedArray);
        formField.images = appendedArray;
            setIsLoading(true);
            postData('/api/homeBanner/create',formField).then(res =>{
                setIsLoading(false);


                deleteData("/api/imageUpload/deleteAllImages");
                history('/homeBannerSlide');

            });          

       } 
    
    useEffect(() =>{
        if(!imgFiles) return;
        let tmp =[];
        for(let i=0;i< imgFiles.length;i++){
            tmp.push(URL.createObjectURL(imgFiles[i]));
        }
        const objectUrls = tmp;
        setPreviews(objectUrls);

        for(let i=0; i< objectUrls.length; i++){
            return()=>{
                URL.revokeObjectURL(objectUrls[i]);
            }
                
        }
    },[imgFiles])

    return (
        <>
             <div className="right-content w-100">
                    <div className="card shadow border-0 w-100 flex-row p-4">
                        <h5 className="mb-0">Add Home Slide</h5>
                        <Breadcrumbs aria-label="breadcrumbs" className="ml-auto breadcrumbs_">
                            <StyleBreadrumb
                                component="a"
                                href="/"
                                label="Home"
                                icon={<HomeIcon fontSize="small" />}
                                style={{ cursor: "pointer" }}
                                />
                                <StyleBreadrumb
                                component="a"
                                 href="/homeBannerSlide"
                                label="Home Slide"
                                deleteIcon={<ExpandMoreIcon />}
                                style={{ cursor: "pointer" }}
                                
                            />
                             <StyleBreadrumb
                                label="Add Home Slide"
                                deleteIcon={<ExpandMoreIcon />}
                            />
                        </Breadcrumbs>

                    </div>

                    <form className='form' onSubmit={addHomeSlide}>
                    <div className='row'>
                        <div className='col-md-12'>
                           
                            <div className='card p-4 mt-0'>
                                <div className='imageUploadSec'>
                                    <h5 className='mb-4'> Media And Published</h5>
                                    <div className='imgUploadBox d-flex align-items-center'>                             
                                      {
                                        previews?.length!==0 && previews?.map((img, index)=>{
                                            return (
                                                <div className='uploadBox' key={index}>
                                                    <span className='remove' onClick={()=> removeImg(index,img)}><IoCloseSharp/></span>
                                                    <div className='box'>
                                                        <img src={img} className='w-100' alt=''/>
                                                    </div>
                                                </div>
                                                
                                            )
                                        })
                                      }
                                        <div className='uploadBox'>
                                            {
                                                uploading === true ?
                                                <div className='progressBar text-center d-flex align-items-center flex-column'><CircularProgress/>
                                                    <span>Uploading...</span>
                                                 </div>
                                                 :
                                                 <>
                                                    <input type='file' multiple onChange={(e) => onChangeFile(e, '/api/homeBanner/upload')} name='images'/>
                                                    <div className='info'>
                                                        <FaRegImages/>
                                                        <h5>Image Upload</h5>
                                                    </div>
                                                 </>
                                            }
                                            
                                        </div>
                                    </div>
                                    <br/>
                                    <Button type="submit" className='btn-blue btn-lg btn-big w-100'><FaCloudUploadAlt/> &nbsp; {isLoading===true ? <CircularProgress color="inherit" className="ml-3 loader" /> : 'PUBLISH AND VIEW'} </Button>
                                
                                </div>
                        <br/>
                            </div>
                            
                        </div>
                    </div>

                    {/* <div className='card p-4 mt-0'>
                        <div className='imageUploadSec'>
                            <h5 className='mb-4'> Media And Published</h5>
                            <div className='imgUploadBox d-flex align-items-center'>  
                            </div>
                           
                        </div>
                        <br/>
                        
                    </div>  */}
                   
                    
                    </form>
                </div>
        </>
    )
}

export default AddHomeSlide;