import MainLayout from "../shared/layouts/MainLayout"
import Card from "../shared/components/Card"
import { Grid } from "@mui/material";
import PaginationBar from "../shared/components/Pagination";
import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedPost } from "../config/redux/reducers/posts/postSlice";

import { fetchBusCompanies } from "../services/Bus/BusCompanyAPI";
import "../shared/styles/BusPage.css"

export default function BusCompanyPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [itemData, setItemData] = useState([]);
    const itemsPerPage = 8;

    useEffect(() => {
        const loadBusCompanies = async () => {
            const companies = await fetchBusCompanies();
            const mappedData = companies.map((company, index) => ({
                title: company.company_name,
                description: company.descriptions,
                img: company.image,
            }));
            setItemData(mappedData);
        };
        loadBusCompanies();
    }, []);

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = itemData.slice(startIndex, endIndex);

    const handleChange = (e, value) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: "smooth" });  //move to top
    };

    const viewMore = (item) => {
        dispatch(setSelectedPost(item));
        navigate(`/company-detail/${item.title}`);
    };

    return (
        <MainLayout>
            <div className="bus-company-list">
                <h2 className="title-accent-bus">NHÀ XE</h2>
                
                <Grid 
                    container 
                    spacing={4} 
                    justifyContent="center" 
                    sx={{
                        maxWidth: "1500px", 
                        margin: "0 auto",
                    }}
                >
                    {currentItems.map((item, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <div
                                onClick={() => viewMore(item)}
                                style={{
                                    cursor: "pointer",
                                    transition: "transform 0.2s ease",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                            >

                                <Card
                                    title={item.title}
                                    description={item.description}
                                    image={item.img}
                                />
                            </div>
                        </Grid>
                    ))}
                </Grid>

                <PaginationBar 
                    totalItems={itemData.length}
                    itemsPerPage={itemsPerPage}
                    page={page}
                    onChange={handleChange}
                />

                <p>Nhà xe - Vivutoday | 
                    Hệ thống đặt vé online cao cấp, dễ dàng tra cứu giá vé, lịch trình, số điện thoại,
                    tuyến đường của 1000+ hãng xe chất lượng tốt nhất.
                </p>
            </div>
        </MainLayout>
    )
}

