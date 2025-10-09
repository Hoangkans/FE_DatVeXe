import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRef } from "react";

import sample from "../../../assets/sample.png"
import "../../styles/HomePage.css"

export default function SliderContent() {
    const routes = [
        { id: 1, name: "Sài Gòn - Vũng Tàu", price: "150.000đ", img:`${sample}` },
        { id: 2, name: "Sài Gòn - Mũi Né", price: "180.000đ", img:`${sample}` },
        { id: 3, name: "Sài Gòn - Nha Trang", price: "240.000đ", img:`${sample}` },
        { id: 4, name: "Nha Trang - Đà Lạt", price: "200.000đ", img:`${sample}`},
        { id: 5, name: "Nha Trang - Đà Lạt", price: "200.000đ", img:`${sample}`},
    ];

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
                <h2 className="title-accent"> Uu Dai Noi Bat</h2>
                <div className="slider-wrapper">
                    <button className="arrow left" onClick={() => scroll("left")}>
                        <ArrowBackIosNewIcon />
                    </button>

                    <div className="routes-slider" ref={scrollRef}>
                        {routes.map((route) => (
                            <div key={route.id} className="route-card">
                                <img src={route.img} alt={route.name} />
                                <div className="route-info">
                                    <h3>{route.name}</h3>
                                    <p className="price">{route.price}</p>
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