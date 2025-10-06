import MainLayout from "../layouts/MainLayout"
import Thumbnail from "../components/Thumbnail"

import { useRef } from "react";

import sample from "../assets/sample.png"
import SliderContent from "../components/Slider";
import AdSlider from "../components/adSlider";
import "../styles/HomePage.css"

export default function HomePage() {
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
        <MainLayout>
            <Thumbnail/>
            <SliderContent/>
            <AdSlider/>
            <SliderContent/>
        </MainLayout>
    )
}