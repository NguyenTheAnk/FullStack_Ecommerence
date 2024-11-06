import React from "react";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { Chip, emphasize, styled } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useContext, useEffect, useState } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { MyContext } from '../../App';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { FaCloudUploadAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { postData } from '../../utils/api';
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
const AddSubCat=()=>{
    const [categoryVal, setCategoryVal] = useState('');
    const [isLoading,setIsLoading] = useState(false);
    const [formField, setFormField] = useState({
        category: '',
        subCat: '',
    });
    const changeInput= (e) => {
        setFormField(()=> (
            {
                ...formField,
                [e.target.name]: e.target.value
            }
        ))
    };
    const context = useContext(MyContext);
    const handleChangeCategory = (event) => {
        setCategoryVal(event.target.value);
        setFormField(()=> (
            {
                ...formField,
                category: event.target.value
            }
        ))
      };
      const history =useNavigate();
      const addSubCategory = (e)=> {
        e.preventDefault();
        const formData = new FormData();
        formData.append('category',formField.category);
        formData.append('subCat',formField.subCat);
        if(formField.category==="") {         
            context.setAlertBox({
                open:true,
                error:true,
                msg:'Please select a category!'
            }); 
            return false;          
        } 
        if(formField.subCat==="") {         
            context.setAlertBox({
                open:true,
                error:true,
                msg:'Please enter Sub Category!'
            }); 
            return false;          
        }   
        
        postData('/api/subCat/create',formField).then(res =>{
            setIsLoading(false);    
            context.fetchCategory();
            context.fetchSubCategory();
            history('/subCategory')          
        });
      }
    return(
        <div className="right-content w-100">
                    <div className="card shadow border-0 w-100 flex-row p-4">
                        <h5 className="mb-0">Add Sub Category</h5>
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
                                label="Sub Category"
                                deleteIcon={<ExpandMoreIcon />}
                                
                            />
                             <StyleBreadrumb
                                label="Add Sub Category"
                                deleteIcon={<ExpandMoreIcon />}
                            />
                        </Breadcrumbs>

                    </div>
                    <form className='form' onSubmit={addSubCategory}>
                        <div className='row'>
                            <div className='col-md-12'>
                                <div className='card p-4 mt-0'>
                                    <div className="row">
                                        <div className='col'>
                                            <div className='form-group'>
                                            <h6>CATEGORY</h6>
                                            <Select
                                                displayEmpty
                                                inputProps={{'aria-label': 'Without label'}}
                                                value={categoryVal}
                                                onChange={handleChangeCategory}
                                                className='w-100'
                                                name="category"
                                                >
                                                <MenuItem value="">
                                                    <em value={null}>None</em>
                                                </MenuItem>
                                                {
                                                    context.catData?.categoryList?.length!==0 && context.catData?.categoryList?.map((cat,index)=>{
                                                        return (
                                                            <MenuItem className='text-capitalize' value={cat.id} key={index}>{cat.name}</MenuItem>
                                                        )
                                                    })
                                                }
                                                
                                        
                                            </Select>
                                            </div>
                                        </div>  
                                        <div className='col'>
                                            <div className='form-group'>
                                                <h6>SUB CATEGORY</h6>
                                                <input type='text' name='subCat' value={formField.subCat} onChange={changeInput}/>
                                            </div>
                                        </div>
                                    </div>
                                    <Button type="submit" className='btn-blue btn-lg btn-big w-100'><FaCloudUploadAlt/> &nbsp; {isLoading===true ? <CircularProgress color="inherit" className="ml-3 loader" /> : 'PUBLISH AND VIEW'} </Button>

                                </div>
                            </div>
                        </div>
                    </form>
                    </div>
    )
}

export default AddSubCat;