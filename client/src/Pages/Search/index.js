import Sidebar from "../../Components/Sidebar";
import Button from '@mui/material/Button';
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { CgMenuGridO } from "react-icons/cg";
import { HiViewGrid } from "react-icons/hi";
import { FaAngleDown } from "react-icons/fa6";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState, useEffect } from 'react';
import ProductItem from "../../Components/ProductItem";
// import Pagination from '@mui/material/Pagination';
import { fetchDataFromAPI } from "../../utils/api";
import { useParams } from "react-router-dom";
import { MyContext } from "../../App";
import { useContext } from 'react';
const SearchPage = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [productView, setProductView] = useState('four');
    const [productsData, setProductsData] = useState([]);
    const [itemsPerRow, setItemsPerRow] = useState(4);
    // const [currentPage, setCurrentPage] = useState(1); 
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const openDropdown = Boolean(anchorEl);
    const { subCatId } = useParams();
    const { catId } = useParams();
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (numItems) => {
        setAnchorEl(null);
        if (numItems) {
            setItemsPerPage(numItems);
            setItemsPerRow(numItems);
        }
    };
    const context = useContext(MyContext);
    useEffect(()=>{
        window.scrollTo(0, 0);
       setTimeout(()=>{
            setProductsData(context.searchData);
       },2000)
    },[context.searchData])
    useEffect(() => {
        const apiUrl = subCatId
            ? `/api/products?subCatId=${subCatId}`
            : `/api/products?catId=${catId}`; 
        fetchDataFromAPI(apiUrl).then((res) => {
            setTimeout(()=>{
                setProductsData(res);
               },1000)
            
        });
        // setProductsData(context.productData);
    }, [catId, subCatId]);

    const filterData = (subCatId) => {
        fetchDataFromAPI(`/api/products?subCatId=${subCatId}`).then((res) => {
            setProductsData(res.productList);
        });
    };
    const filterByBrand = (brand) => {
        fetchDataFromAPI(`/api/products?brand=${brand}`).then((res) => {
            setProductsData(res.productList);
        });
    };    

    const filterByPrice = (price,subCatId) => {
        fetchDataFromAPI(`/api/products?minPrice=${price[0]}&maxPrice=${price[1]}&subCatId=${subCatId}`)
            .then((res) => {
                setProductsData(res.productList);
    });
}
    // const indexOfLastProduct = currentPage * itemsPerPage;
    // const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    // const currentProducts = productsData?.productList?.slice(indexOfFirstProduct, indexOfLastProduct);

    // const totalPages = Math.ceil(productsData?.productList?.length / itemsPerPage);

    return (
        <>
            <section className="product_Listing_Page">
                <div className="container">
                    <div className="productListing d-flex">
                        <Sidebar filterData={filterData} filterByPrice={filterByPrice} filterByBrand={filterByBrand}/>
                        <div className="content_right">
                            <img src="http://localhost:3000/static/media/slideBanner1.480c808c6e6ed7f55e43.jpg" className="w-100" style={{ borderRadius: '8px' }} alt="" />

                            <div className="showBy mt-3 mb-3 d-flex align-items-center ">
                                <div className="d-flex align-items-center btnWrapper">
                                    <Button className={productView === 'two' && 'act'} onClick={() => { setProductView('two'); setItemsPerRow(2); }}><HiViewGrid /></Button>
                                    <Button className={productView === 'three' && 'act'} onClick={() => { setProductView('three'); setItemsPerRow(3); }}><CgMenuGridO /></Button>
                                    <Button className={productView === 'four' && 'act'} onClick={() => { setProductView('four'); setItemsPerRow(4); }}><TfiLayoutGrid4Alt /></Button>
                                </div>

                                <div className="ml-auto showByFilter">
                                    <Button onClick={handleClick}>Show {itemsPerPage} <FaAngleDown /></Button>
                                    <Menu
                                        className="w-100 showPerPageDropdown"
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={openDropdown}
                                        onClose={handleClose}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                    >
                                        <MenuItem onClick={() => handleClose(5)}>5</MenuItem>
                                        <MenuItem onClick={() => handleClose(6)}>6</MenuItem>
                                        <MenuItem onClick={() => handleClose(7)}>7</MenuItem>
                                        <MenuItem onClick={() => handleClose(8)}>8</MenuItem>
                                    </Menu>
                                </div>
                            </div>

                            <div className="product_row w-100 mt-4" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {
                                    productsData?.length > 0 && productsData?.map((item, index) => {
                                        return (
                                            <div key={index} style={{ width: `${(100 / itemsPerRow).toFixed(2)}%`, boxSizing: 'border-box' }}>
                                                <ProductItem itemView= {productView} item={item} />
                                            </div>
                                        );
                                    })
                                }
                            </div>

                            <div className="d-flex align-items-center justify-content-center mt-5 tableFooter">
                                {/* <Pagination 
                                    count={totalPages} 
                                    page={currentPage}
                                    onChange={(event, value) => setCurrentPage(value)}
                                    color="primary" 
                                    className="pagination" 
                                    showFirstButton 
                                    showLastButton 
                                /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SearchPage;
