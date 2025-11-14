import MainLayout from "../shared/layouts/MainLayout"
import Card from "../shared/components/Card"
import { Grid } from "@mui/material";

import PaginationBar from "../shared/components/Pagination";
import { useState, useEffect } from "react";

import { fetchBusStation } from "../services/Station/StationApi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedPost } from "../config/redux/reducers/posts/postSlice";
import "../shared/styles/BusPage.css"

export default function BusStationPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [itemData, setItemData] = useState([]);
    const [page, setPage] = useState(1);
    const itemsPerPage = 8;

    useEffect( () => {
        const loadBusStations = async () => {
            const result = await fetchBusStation();
            const stations = result.data;
            const mappedData = stations.map((station, index) => ({
                title: station.name,
                description: station.descriptions,   
                img: station.image,
                wallpaper: station.wallpaper,
                location: station.location,
            }));
            setItemData(mappedData);
        }
        loadBusStations();
    }, [])

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = itemData.slice(startIndex, endIndex);

    const handleChange = (e, value) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: "smooth" }); 
    };

    const viewMore = (item) => {
        dispatch(setSelectedPost(item));
        navigate(`/station-detail/${item.title}`);
    };

    return (
        <MainLayout>
            <div className="bus-company-list">
                <h2 className="title-accent-bus">BẾN XE</h2>
                
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
                        <Grid item xs={12} sm={6} md={3} key={index} >
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
                                onClick={() => viewMore(item)}
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

                <p>Tập hợp các bến xe và thông tin chi tiết lịch trình,
                    giờ khởi hành của các nhà xe có tại bến.
                </p>
            </div>
        </MainLayout>
    )
}

