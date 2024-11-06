// import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchDataFromAPI } from '../../utils/api';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Rating from '@mui/material/Rating';
import { useParams } from 'react-router-dom';
const Sidebar =(props)=>{

    const [value, setValue] = useState([100,60000]);
    // const [value2, setValue2] = useState(0);
    const [catData, setCatData]= useState([]);
    const [subCatData, setSubCatData]= useState([]);
    const [productsData, setProductsData]= useState([]);
    const [subCatId, setSubCatId]= useState('');
    const [filterSubCat, setFilterSubCat] = React.useState();
    const [selectedBrands, setSelectedBrands] = useState('');
    const {id} = useParams();

    useEffect(()=>{
        setSubCatId(id);
    },[id])
    useEffect(()=>{
        fetchDataFromAPI("/api/category/").then((res)=>{
             setCatData(res);
             
        });
        fetchDataFromAPI("/api/subCat/").then((res)=>{
            setSubCatData(res);
            
       });
       fetchDataFromAPI("/api/products/").then((res)=>{
        setProductsData(res);
        
   });
     
     },[]);

     

     const handleChange =(event)=>{
        setFilterSubCat(event.target.value);
        props.filterData(event.target.value);
        setSubCatId(event.target.value);
     }
     const handleBrandChange = (event) => {
        const selectedBrand = event.target.value;
        setSelectedBrands(prevBrand => prevBrand === selectedBrand ? '' : selectedBrand);
        console.log(selectedBrand);
    };
     useEffect(()=>{
        props.filterByPrice(value,subCatId);
        props.filterByBrand(selectedBrands);
     },[value,selectedBrands])
    return (
        <>
        
            <div className="sidebar">
            
                <div className="filterBox">
                    <h6>PRODUCT CATEGORIES</h6>

                    <div className='scroll'>
                               
                                         <RadioGroup
                                            aria-labelledby="demo-controlled-radio-buttons-group"
                                            name="controlled-radio-buttons-group"
                                            value={filterSubCat}
                                            onChange={handleChange}
                                            >
                                                {
                                                     subCatData?.subCategoryList?.length !== 0 && subCatData?.subCategoryList?.map((subCat, index) =>{
                                                        return(
                                                                <FormControlLabel value={subCat?.id} control={<Radio />} label={subCat?.subCat} />
                                                        )
                                                     })
                                                }
                                            
                                        </RadioGroup>                                       
                       

                    </div>
                    </div>

                    <div className='filterBox'>
                        <h6>FILTER BY PRICE</h6>
                        <RangeSlider value = {value} onInput= {setValue} min = {100} max = {60000} step= {5} />
                        <div className='d-flex pt-2 pb-2 priceRange'>
                            <span>
                                From: <strong className='text-dark'>Rs: {value[0]}</strong>
                            </span>
                            <span className='ml-auto'>From: <strong className='text-dark'>Rs: {value[1]}</strong></span>
                        </div>
                    </div>     

                    <div className="filterBox">
                    <h6>BRANDS</h6>
                    <RadioGroup
                        name="brand-radio-group"
                        value={selectedBrands}
                        onChange={handleBrandChange}
                    >
                        <div className='scroll'>
                            <ul>
                                {productsData?.productList?.length !== 0 && (
                                    Array.from(new Set(productsData?.productList?.map(item => item.brand))).map((brand, index) => {
                                        const brandProducts = productsData?.productList?.filter(item => item.brand === brand);
                                        return (
                                            <li key={index}>
                                                <FormControlLabel
                                                    className='w-100'
                                                    value={brand}
                                                    control={<Radio />}
                                                    label={
                                                        <span className="d-flex align-items-center">
                                                            <span style={{ background: brandProducts[0]?.category.color, width: '10px', height: '10px', borderRadius: '50%' }} />
                                                            {brand}
                                                        </span>
                                                    }
                                                />
                                            </li>
                                        );
                                    })
                                )}
                            </ul>
                        </div>
                    </RadioGroup>
                    </div>


                    <Link to = "#"><img src='http://localhost:3000/static/media/banner3.0b4c397e8321b77c3ddb.jpg' className='w-100' alt=''/></Link> 
            </div>
        </>
    )
}

export default Sidebar;