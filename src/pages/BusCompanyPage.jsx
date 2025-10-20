import MainLayout from "../shared/layouts/MainLayout"
import Card from "../shared/components/Card"
import { Grid } from "@mui/material";
import sample from "../assets/sample.png"
import PaginationBar from "../shared/components/Pagination";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedPost } from "../config/redux/reducers/posts/postAction";
import "../shared/styles/BusPage.css"

export default function BusCompanyPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const itemsPerPage = 8;

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
                        maxWidth: "1800px", 
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

const itemData = [
    {
        img: `${sample}`,
        title: 'Sai Gon',
        description: '287 bai viet',
    },
    {
        img: `${sample}`,
        title: 'Vung Tau',
        description: 'Vũng Tàu là một thành phố biển thuộc tỉnh Bà Rịa - Vũng Tàu, nằm ở miền Đông Nam Bộ và hướng ra Biển Đông.',  
    },
    {
        img: `${sample}`,
        title: 'Ha Noi',
        description: '612 bai viet',
    },
    {
        img: `${sample}`,
        title: 'Da Lat',
        description: '87 bai viet',
    },
    {
        img: `${sample}`,
        title: 'Quy Nhon',
        description: '81 bai viet',
    },
    {
        img: `${sample}`,
        title: 'Nha Trang',
        description: '557 bai viet',
    },
    {
        img: `${sample}`,
        title: 'Da Nang',
        description: '570 bai viet',
    },
    {
        img: `${sample}`,
        title: 'Phan Thiet',
        description: '276 bai viet',
    },
    {
        img: `${sample}`,
        title: 'Con Dao',
        description: '111 bai viet',
    },
    {
        img: `${sample}`,
        title: 'Phu Quoc',
        description: '136 bai viet',
    }
];