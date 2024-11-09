
import { useContext, useEffect, useState} from "react";
import Button from '@mui/material/Button';
import { FaPencilAlt } from "react-icons/fa";
import { BiSolidTrashAlt } from "react-icons/bi";
import { MyContext } from "../../App";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Checkbox, Chip, emphasize, Pagination, styled } from "@mui/material";
import { Link } from "react-router-dom";
import { deleteData, fetchDataFromAPI } from "../../utils/api";
import { useNavigate } from 'react-router-dom';

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
const CategoryList = () => {

    // const open = Boolean(anchorEl);
    // const ITEM_HEIGHT = 48;
    // const [editFields, setEditFields] = useState({});
    const [catData, setCatData] = useState([]);
    // const [page, setpage]= useState(1);
    const context = useContext(MyContext);


    useEffect(() => {
        context.setIsHideSidebarAndHeader(false);
        window.scrollTo(0, 0);
        context.setProgress(20)
        fetchDataFromAPI('/api/category').then((res)=>{
            setCatData(res);
            console.log(res);
            context.setProgress(100)
        })
    },[]);
    
   

   
    const history = useNavigate();
    const deleteCat=(id)=>{
        context.setProgress(40);
        deleteData(`/api/category/${id}`).then((res) =>{
            context.setProgress(100);
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Category deleted successfully!'
            })
            fetchDataFromAPI('/api/category').then((res)=>{
                setCatData(res);
            })
        })
        history('/category');
    }

    const handleChange =(event, value)=>{
        context.setProgress(40)
        fetchDataFromAPI(`/api/category?page=${value}`).then((res)=>{
            setCatData(res);
            context.setProgress(100)
        })
    }
    return (
        <>
            <div className="right-content w-100">
                    <div className="card shadow border-0 w-100 flex-row p-4">
                        <h5 className="mb-0">Category List</h5>
                        <div className="ml-auto d-flex align-items-center" >
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
                                href="/category"
                                label="Category"
                                deleteIcon={<ExpandMoreIcon />}
                                style={{ cursor: "pointer" }}
                            />
                              
                        </Breadcrumbs>
                        <Link to= "/category/add"><Button className='btn-blue ml-3 pl-3 pr-3'>Add Category</Button></Link>
                        </div>
                    </div>

                <div className="card shadow border-0 p-3 mt-4 ">
                    <div className="row cardFilters mt-2">                       
                        <div className="table-responsive">
                            <table className="table table-bordered v-align">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>UID</th>
                                            <th style={{width: '200px'}}>IMAGE</th>
                                            <th style={{width: '250px'}}>CATEGORY</th>
                                            <th>COLOR</th>
                                            <th>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            catData?.categoryList?.length!==0 && catData?.categoryList?.map((item, index)=>{
                                                return(
                                                    <tr>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <Checkbox {...label}/>
                                                                <span>#{index + 1}</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                        <div className="imgWrapper">
                                                                <div className="img">
                                                                <img src={item.images[0]} alt="" className="w-100"/>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{item.name}</td>                           
                                                        <td>
                                                            {item.color}
                                                        </td>
                                                        <td>
                                                            <div className="actions d-flex align-items-center">
                                                                <Link to={`/category/edit/${item.id}`}>
                                                                    <Button className="success" color="success"><FaPencilAlt/></Button>
                                                                </Link>
                                                                <Button className="error" color="error" onClick={()=> deleteCat(item.id)}><BiSolidTrashAlt/></Button>
                                                            </div>
                                                        </td>
                                                    </tr> 
                                                )
                                            })
                                        }
                                                                             
                                    </tbody>
                            </table>
                            {
                                catData?.totalPages>1 && 
                                <div className="d-flex tableFooter">
                                <Pagination count={catData?.totalPages} color="primary" className="pagination" showFirstButton showLastButton onChange={handleChange}/>   
                                </div>  
                            }
                                                  
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}


export default CategoryList;