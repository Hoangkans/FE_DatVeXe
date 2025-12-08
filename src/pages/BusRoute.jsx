import MainLayout from "../shared/layouts/MainLayout"
import Card from "../shared/components/Card"
import { Grid } from "@mui/material";

import PaginationBar from "../shared/components/Pagination";
import { useState, useEffect } from "react";
import { fetchAllArticle } from "../services/post/post";

import "../shared/styles/BusPage.css"
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedPost } from "../config/redux/reducers/posts/postSlice";

export default function BusRoutePage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [itemData, setItemData] = useState([]);
    const [page, setPage] = useState(1);
    const itemsPerPage = 8;

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = itemData.slice(startIndex, endIndex);

    useEffect(() => {
        const loadBusRoute = async () => {
            const res = await fetchAllArticle();
            const routes = res.data

            const normalize = (str) =>
            str
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") 
                .replace(/\s+/g, "");           

            const filtered = routes.filter(route => {
                
            const t = normalize(route.title.toLowerCase());
            return t.includes("tuyen"); 
        });
            const mappedData = filtered.map((route, index) => ({
                title: route.title,
                content: route.content,
                wallpaper: route.image,
            }));
            setItemData(mappedData);
        };
        loadBusRoute();
    }, []);

    const handleChange = (e, value) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: "smooth" });  
    };

    const viewMore = (item) => {
        dispatch(setSelectedPost(item))
        navigate(`/route-detail/${item.title}`)
    }

    return (
        <MainLayout>
            <div className="bus-company-list">
                <h2 className="title-accent-bus">TUYẾN ĐƯỜNG</h2>
                
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
                                    image={item.wallpaper}
                                    description={item.content}
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
            </div>
        </MainLayout>
    )
}

