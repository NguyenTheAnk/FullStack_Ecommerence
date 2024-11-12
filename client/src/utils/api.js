import axios from "axios";


export const fetchDataFromAPI = async(url)=> {
    try{
        const {data} = await axios.get("http://localhost:4000"+url)
        return data;
    }catch(error){       
        return error;
    }
}

// export const uploadImage = async(url, formData)=>{
//     const {res} = await axios.post("http://localhost:4000" + url, formData);
//     return res;
// }
export const postDataImg = async (url, formData) => {
    try {
        const response = await fetch("http://localhost:4000" + url, {
            method: "POST",
            body: formData // Bỏ Content-Type để fetch tự động thêm
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const errorData = await response.json();
            return errorData;
        }
    } catch (error) {
        console.error("Request failed:", error);
        return { error: true, msg: error.message };
    }
};
export const postData = async(url, formData)=>{
    try{

        const response = await fetch("http://localhost:4000"+url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })

        if(response.ok){
            const data = await response.json();
            return data;
        }
        else{
            const errorData = await response.json();
            return errorData;
        }
        // const {res} = await axios.post("http://localhost:4000"+url, formData);
        // return res;
    }catch(error){
        console.error("Request failed:", error);
        return { error: true, msg: error.msg };
    }
    
}

export const editData = async(url, updateData)=>{
    try{
        const {res} = await axios.put(`http://localhost:4000${url}`, updateData)
        return res; 
    }catch(error){
        console.log(error);
        return error;
    }
    
}

export const deleteData = async(url)=>{
    try{
        const {res} = await axios.delete(`http://localhost:4000${url}`)
        return res; 
    }catch(error){
        console.log(error);
        return error;
    }
    
}
export const deleteImages= async (url, image)=>{
    const {res} = await axios.delete(`http://localhost:4000${url}`, image);
    return res;
}
