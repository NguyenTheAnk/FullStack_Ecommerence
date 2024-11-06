import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
const QuantityBox= (props) => {

    const [inputVal, setInputVal] =  useState(1);

    const minus = ()=> {
        if(inputVal !==1 && inputVal >0){
            setInputVal(inputVal -1);
        }
        
    }
    const plus = ()=> {
        setInputVal(inputVal +1);
    }
    useEffect(()=>{
        if(props?.value!==undefined && props.value!==null && props.value!==""){
            setInputVal(parseInt(props?.value));
        }
    },[props.value])
    useEffect(()=>{
         if (typeof props.quantity === 'function') {
            props.quantity(inputVal);
         }
        if (typeof props.selectedItem === 'function') {
            props.selectedItem(props.item, inputVal);
        }
    },[inputVal]);
    return (
        <div className='quantityDrop d-flex align-items-center'>
            <Button onClick={minus}><FaMinus/></Button>
            <input type="text" value={inputVal}/>
            <Button onClick={plus}><FaPlus/></Button>
        </div>
    )
}

export default QuantityBox;