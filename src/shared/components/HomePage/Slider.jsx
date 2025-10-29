import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRef, useState, useEffect } from "react";

import { fetchBusImage } from "../../../services/Bus/BusApi"
import "../../styles/HomePage.css"

export default function SliderContent() {
    const [bus, setBus] = useState([]);

    useEffect(() => {
        const loadBusData = async () => {
            try {
                const data = await fetchBusImage();
                setBus(data || []);
            }catch (err){
                console.log("Failed to fectch bus data: ",err)
                return [];
            }
        }
        loadBusData();
    }, [])

    const scrollRef = useRef(null);

    const scroll = (dir) => {
        const container = scrollRef.current;
        const card = container.querySelector(".route-card");

        if (!card) return;

        const cardWidth = card.offsetWidth + 20; 
        if (dir === "left") container.scrollLeft -= cardWidth;
        else container.scrollLeft += cardWidth;
    };

    return (
        <>
            <div className="slide-content">
                <h2 className="title-accent"> Ưu đãi nổi bật</h2>
                <div className="slider-wrapper">
                    <button className="arrow left" onClick={() => scroll("left")}>
                        <ArrowBackIosNewIcon />
                    </button>

                    <div className="routes-slider" ref={scrollRef}>
                        {bus?.map((item) => (
                            <div key={item.id} className="route-card">
                                <img src={item.image_url} alt={item.bus.name} />
                                <div className="route-info">
                                    <h3>{item.bus.name}</h3>
                                    <p className="price">{item.bus.descriptions}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="arrow right" onClick={() => scroll("right")}>
                        <ArrowForwardIosIcon />
                    </button>
                </div>
            </div>
        </>
    )
}