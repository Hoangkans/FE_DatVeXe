import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRef } from "react";
import { Link } from "react-router-dom";

import "../../styles/HomePage.css"

export default function SliderContent({
    title,
    items = null,
    getImageUrl,
    getTitle,
    getSubtitle,
    getLink
}) {

    const scrollRef = useRef(null);

    const scroll = (dir) => {
        const container = scrollRef.current;
        const card = container.querySelector(".route-card");

        if (!card) return;

        const cardWidth = card.offsetWidth + 20; 
        if (dir === "left") container.scrollLeft -= cardWidth;
        else container.scrollLeft += cardWidth;
    };

    const handleNavigation = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <div className="slide-content">
                <h2 className="title-accent"> {title} </h2>
                <div className="slider-wrapper">
                    <button className="arrow left" onClick={() => scroll("left")}>
                        <ArrowBackIosNewIcon />
                    </button>

                    <div className="routes-slider" ref={scrollRef}>
                        {items?.map((item) => (
                            <Link 
                                to={getLink ? getLink(item) : "#"} 
                                key={item.id} 
                                className="route-card"
                                onClick={handleNavigation} 
                                style={{ textDecoration: 'none', color: 'inherit' }} 
                            >
                                <img src={getImageUrl(item)} alt={getTitle(item)} />
                                <div className="route-info">
                                    <h3>{getTitle(item)}</h3>
                                    <p className="price">{getSubtitle(item)}</p>
                                </div>
                            </Link>
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