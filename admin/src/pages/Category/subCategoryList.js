
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
const SubCategoryList = () => {

    // const open = Boolean(anchorEl);
    // const ITEM_HEIGHT = 48;
    // const [editFields, setEditFields] = useState({});
    const [subCatData, setSubCatData] = useState([]);
    // const [page, setpage]= useState(1);
    const context = useContext(MyContext);


    useEffect(() => {
        context.setIsHideSidebarAndHeader(false);
        window.scrollTo(0, 0);
        context.setProgress(20)
        fetchDataFromAPI('/api/subCat').then((res)=>{
            setSubCatData(res);
            console.log(res);
            context.setProgress(100)
        })
    },[]);
    
   

   
    const history = useNavigate();
    const deleteSubCat=(id)=>{
        context.setProgress(40);
        deleteData(`/api/subCat/${id}`).then((res) =>{
            context.setProgress(100);
            context.setAlertBox({
                open: true,
                error: true,
                msg: 'Sub Category deleted successfully!'
            })
            fetchDataFromAPI('/api/subCat').then((res)=>{
                setSubCatData(res);
            })
        })
        history('/subCategory');
    }

    const handleChange =(event, value)=>{
        context.setProgress(40)
        fetchDataFromAPI(`/api/subCat?page=${value}`).then((res)=>{
            setSubCatData(res);
            context.setProgress(100)
        })
    }
    return (
        <>
            <div className="right-content w-100">
                    <div className="card shadow border-0 w-100 flex-row p-4">
                        <h5 className="mb-0">Sub Category List</h5>
                        <div className="ml-auto d-flex align-items-center">
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
                                href="/subCategory"
                                label="Sub Category"
                                deleteIcon={<ExpandMoreIcon />}
                                style={{ cursor: "pointer" }}
                            />
                              
                        </Breadcrumbs>
                        <Link to= "/subCategory/add"><Button className='btn-blue ml-3 pl-3 pr-3'>Add Sub Category</Button></Link>
                        </div>
                    </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <div className="row cardFilters mt-2">                       
                        <div className="table-responsive">
                            <table className="table table-bordered v-align">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>UID</th>
                                            <th style={{width: '200px'}}>CATEGORY IMAGE</th>
                                            <th style={{width: '400px'}}>CATEGORY</th>
                                            <th>SUB CATEGORY</th>
                                            <th>ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            subCatData?.subCategoryList?.length!==0 && subCatData?.subCategoryList?.map((item, index)=>{
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
                                                                <img src={item?.category?.images[0]} alt="" className="w-100"/>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{item.category?.name}</td>                           
                                                        <td>
                                                            {item?.subCat}
                                                        </td>
                                                        <td>
                                                            <div className="actions d-flex align-items-center">
                                                                <Link to={`/subCategory/edit/${item.id}`}>
                                                                    <Button className="success" color="success"><FaPencilAlt/></Button>
                                                                </Link>
                                                                <Button className="error" color="error" onClick={()=> deleteSubCat(item.id)}><BiSolidTrashAlt/></Button>
                                                            </div>
                                                        </td>
                                                    </tr> 
                                                )
                                            })
                                        }
                                                                             
                                    </tbody>
                            </table>
                            {
                                subCatData?.totalPages>1 && 
                                <div className="d-flex tableFooter">
                                <Pagination count={subCatData?.totalPages} color="primary" className="pagination" showFirstButton showLastButton onChange={handleChange}/>   
                                </div>  
                            }
                                                  
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}


export default SubCategoryList;