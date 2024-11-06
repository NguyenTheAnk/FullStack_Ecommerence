import React, { useEffect } from "react";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { Chip, emphasize, styled } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useContext, useState } from 'react';
import { MyContext } from '../../App';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { FaCloudUploadAlt } from "react-icons/fa";
import {  useNavigate } from 'react-router-dom';
import { deleteData, editData, fetchDataFromAPI, postData } from '../../utils/api';
import { FaPencilAlt } from "react-icons/fa";
import { BiSolidTrashAlt } from "react-icons/bi";
import Checkbox from '@mui/material/Checkbox';
const label = {inputProps: {'aria-label': 'Checkbox demo'}};

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
const AddProductSize=()=>{
    const [editId,setEditId] = useState('');
    const [isLoading,setIsLoading] = useState(false);
    const [productSizeData, setProductSizeData] = useState([]);
    const [formField, setFormField] = useState({
        productSize: '',
    });
    const changeInput= (e) => {
        setFormField(()=> (
            {
                ...formField,
                [e.target.name]: e.target.value
            }
        ))
    };
    useEffect(()=>{
        fetchDataFromAPI("/api/productSize").then((res)=>{
            setProductSizeData(res);
        })
    },[]);
    const context = useContext(MyContext);
    const history =useNavigate();

    const addProductSize= (e)=> {
        e.preventDefault();
        const formData = new FormData();
        formData.append('productSize',formField.productSize);

        if(formField.productSize==="") {         
            context.setAlertBox({
                open:true,
                error:true,
                msg:'Please add product Size!'
            }); 
            return false;          
        }  
        setIsLoading(true);
        if(editId===""){
            postData('/api/productSize/create',formField).then(res =>{
                setIsLoading(false);   
                setFormField({
                    productSize:"",
                }) 
                fetchDataFromAPI("/api/productSize").then((res)=>{
                    setProductSizeData(res);
                })
                history('/productSize/add')          
            });
        }else{
            editData(`/api/productSize/${editId}`, formField).then((res)=>{
                fetchDataFromAPI("/api/productSize").then((res)=>{
                    setEditId("");
                    setProductSizeData(res);
                    setIsLoading(false);   
                    setFormField({
                        productSize:"",
                    }) 
                })
            })
        }
        
      }

      const deleteItem= (id)=>{
        deleteData(`/api/productSize/${id}`).then((res)=>{
            setEditId(true);
            fetchDataFromAPI("/api/productSize").then((res)=>{
               
                setProductSizeData(res);
            })
        })
      };
      const updateData = (id)=>{
        fetchDataFromAPI(`/api/productSize/${id}`).then((res)=>{
            setEditId(id);
            setFormField({
                productSize: res.productSize,
            })
        })
      }
    return(
        <div className="right-content w-100">
                    <div className="card shadow border-0 w-100 flex-row p-4">
                        <h5 className="mb-0">Add Product SIZE</h5>
                        <Breadcrumbs aria-label="breadcrumbs" className="ml-auto breadcrumbs_">
                            <StyleBreadrumb
                                component="a"
                                href="/"
                                label="Home"
                                icon={<HomeIcon fontSize="small" />}
                                />
                                <StyleBreadrumb
                                component="a"
                                 href="#"
                                label="Product SIZE"
                                deleteIcon={<ExpandMoreIcon />}
                                
                            />
                             <StyleBreadrumb
                                label="Add Product SIZE"
                                deleteIcon={<ExpandMoreIcon />}
                            />
                        </Breadcrumbs>

                    </div>
                    <form className='form' onSubmit={addProductSize}>
                        <div className='row'>
                            <div className='col-sm-9'>
                                <div className='card p-4 mt-0'>
                                    <div className="row"> 
                                        <div className='col'>
                                            <div className='form-group'>
                                                <h6>PRODUCT SIZE</h6>
                                                <input type='text' name='productSize' value={formField.productSize} onChange={changeInput}/>
                                            </div>
                                        </div>
                                    </div>
                                    <Button type="submit" className='btn-blue btn-lg btn-big w-100'><FaCloudUploadAlt/> &nbsp; {isLoading===true ? <CircularProgress color="inherit" className="ml-3 loader" /> : 'PUBLISH AND VIEW'} </Button>

                                </div>
                            </div>
                        </div>
                    </form>
                        {
                            productSizeData.length!==0 && 
                            <div className="row">
                            <div className="col-sm-9 ">
                            <div className="card p-4 mt-0">
                                <div className="table-responsive mt-3">
                                    <table className="table table-bordered v-align">
                                            <thead className="thead-dark">
                                                <tr>
                                                    <th width ="25%">UID</th>
                                                    <th>PRODUCT SIZE</th>
                                                    <th width ="25%">ACTIONS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    productSizeData?.map((item, index)=>{
                                                        return(
                                                            <tr key={index}>
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        <Checkbox {...label}/>
                                                                        <span>#{index +1}</span>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    {item?.productSize}
                                                                </td>
                                                                <td>
                                                                    <div className="actions d-flex align-items-center">                                                                     
                                                                        <Button className="success" color="success" onClick={()=> updateData(item.id)}><FaPencilAlt/></Button>
                                                                        <Button className="error" color="error" onClick={()=>deleteItem(item.id)}><BiSolidTrashAlt/></Button>
                                                                    </div>
                                                                </td>
                                                        </tr>             
                                                        )
                                                    })
                                                }
                                                                 
                                                                                    
                                            </tbody>
                                    </table>                           
                                    
                                </div>
                        </div>
                            </div>
                        </div>
                        }
                </div>
    )
}

export default AddProductSize;