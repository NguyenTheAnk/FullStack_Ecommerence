import  Button from '@mui/material/Button';
import { useState } from 'react';
import { IoIosSearch } from "react-icons/io";
import { fetchDataFromAPI } from '../../../utils/api';
import { MyContext } from '../../../App';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBox =()=>{
    
    const [searchFields, setSearchFields] =useState("");
    const onChangeValue=(e)=>{
        setSearchFields(e.target.value);
    }
    const context = useContext(MyContext);
    const history = useNavigate();

    const searchProducts = ()=>{
        fetchDataFromAPI(`/api/search?q=${searchFields}`).then((res)=>{
            context.setSearchData(res);
            history("/search");
        })
    }
    return (
        <div className='headerSearch ml-3 mr-3'>
            <input type='text' placeholder='Search for products...' onChange={onChangeValue}/>
            <Button onClick={searchProducts}><IoIosSearch/></Button>
        </div>
    )
}

export default SearchBox;