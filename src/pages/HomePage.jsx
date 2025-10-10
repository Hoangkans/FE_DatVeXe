import MainLayout from "../shared/layouts/MainLayout"

import Thumbnail from "../shared/components/HomePage/Thumbnail"
import SliderContent from "../shared/components/HomePage/Slider";
import AdSlider from "../shared/components/HomePage/AdSlider";
import TopReview from "../shared/components/HomePage/TopReview";

import "../shared/styles/HomePage.css"

import icon1 from "../assets/claim.png"
import icon2 from "../assets/prize.png"
import icon3 from "../assets/shake.png"
import icon4 from "../assets/support.png"

import img24h from "../assets/brand/24h.png";
import vtc from "../assets/brand/vtc.png";
import eva from "../assets/brand/eva.png";
import afamily from "../assets/brand/afamily.png";
import baria from "../assets/brand/baria.png";
import danang from "../assets/brand/danang.png";

export default function HomePage() {
    const prize = [
        { name: "24h", src: img24h },
        { name: "vtc", src: vtc },
        { name: "eva", src: eva },
        { name: "afamily", src: afamily },
        { name: "baria", src: baria },
        { name: "danang", src: danang },
    ];

    return (
        <MainLayout>
            <Thumbnail/>
            <SliderContent/>
            <AdSlider/>
            <SliderContent/>
            <h2 className="title-accent">Top Review</h2>   
            <TopReview/>
            <SliderContent/>

            <h2 className="title-accent">Nen Tang Ket Noi Nguoi Dung Va Nha Xe</h2>   
            <div className="claim-section">
                <div className="claim-item">
                    <div className="claim-card">
                        <img src={icon1} style={{height: "65px"}}/>
                        <div className="claim-info">
                            <h3>DAP UNG MOI NHU CAU TIM KIEM</h3>
                            <p>Voi hon 5000+ tuyen duong va 1500+ nha xe tren khap ca nuoc</p>
                        </div>
                    </div>
                    <div className="claim-card">
                        <img src={icon2} style={{height: "65px"}}/>
                        <div className="claim-info">
                            <h3>DAM BAO CO VE</h3>
                            <p>Hoan ngay 150% neu khong co ve, mang den hanh trinh chon ven</p>
                        </div>
                    </div>
                </div>

                <div className="claim-item">
                    <div className="claim-card">
                        <img src={icon3} style={{height: "65px"}} />
                        <div className="claim-info">
                            <h3>CAM KET GIU VE</h3>
                            <p>Vivutoday cam ket hoan 150% neu nha xe khong giu ve</p>
                        </div>
                    </div>
                    <div className="claim-card">
                        <img src={icon4} style={{height: "65px"}}/>
                        <div className="claim-info">
                            <h3>TONG DAI HO TRO KHACH HANG 24/7</h3>
                            <p>Giai quyet kip thoi van de cua khach hang mot cach nhanh chong</p>
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="title-accent">Nen Tang Ket Noi Nguoi Dung Va Nha Xe</h2>
            <div className="prize-section">
                <div className="prize-list">
                    {prize.map((item, index) => (
                        <div key={index} className="prize-card">
                            <img src={item.src} alt={item.name} />
                        </div>
                    ))}
                </div>
            </div>

        </MainLayout>
    )
}