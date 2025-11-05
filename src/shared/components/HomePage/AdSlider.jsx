import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRef, useState, useEffect } from "react";
import { fetchBanner } from "../../../services/banner/userBanner";

import "../../styles/Slider.css"

export default function AdSlider() {
    const [banners, setBanners] = useState([]);   
    const scrollRef = useRef(null);
    
     useEffect(() => {
        loadBanners();
    }, []);

    const loadBanners = async () => {
        try {
        const responseData = await fetchBanner();

        let bannerList = [];
        if (Array.isArray(responseData)) {
            bannerList = responseData;
        } else if (responseData && Array.isArray(responseData.data)) {
            bannerList = responseData.data;
        }
        
        const mappedData = bannerList.map(banner => ({
            id: banner.id,
            image: banner.banner_url ,
            position: banner.position
        }));
        
        const homepageBanner = mappedData.filter(banner=> {
            return banner.position === 'homepage'
        })
        setBanners(homepageBanner)
        } catch (error) {
            console.error("Error loading banners:", error);
        } 
    };
    
    const scroll = (dir) => {
        const container = scrollRef.current;
        const card = container.querySelector(".route-card-ad");

        if (!card) return;

        const cardWidth = card.offsetWidth + 20; 
        if (dir === "left") container.scrollLeft -= cardWidth;
        else container.scrollLeft += cardWidth;
    };

    return (
        <>
            <div className="slide-content-ad">
                <h2 className="title-accent-ad"> Ưu đãi nổi bất </h2>
                <div className="slider-wrapper-ad">
                    <button className="arrow left" onClick={() => scroll("left")}>
                        <ArrowBackIosNewIcon />
                    </button>

                    <div className="routes-slider-ad" ref={scrollRef}>
                        {banners.map((banner) => (
                            <div key={banner.id} className="route-card-ad">
                                <img src={banner.image} />
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