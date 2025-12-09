import MainLayout from "../shared/layouts/MainLayout"

import Thumbnail from "../shared/components/HomePage/Thumbnail"
import SliderContent from "../shared/components/HomePage/Slider";
import AdSlider from "../shared/components/HomePage/AdSlider";
import TopReview from "../shared/components/HomePage/TopReview";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
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

import { fetchPopularBuses } from "../config/redux/thunks/Bus/Popular";
import { fetchPopularStations } from "../config/redux/thunks/Bus/Popular";

export default function HomePage() {
    const prize = [
        { name: "24h", src: img24h },
        { name: "vtc", src: vtc },
        { name: "eva", src: eva },
        { name: "afamily", src: afamily },
        { name: "baria", src: baria },
        { name: "danang", src: danang },
    ];

    const dispatch = useDispatch();

    const busData = useSelector((state) => state.buses.data)
    const busStatus = useSelector((state) => state.buses.status)
    const stationData = useSelector((state) => state.stations.data)
    const stationStatus = useSelector((state) => state.stations.status)

    useEffect(() => {
        if (busStatus === 'idle') {
            dispatch(fetchPopularBuses());
        }
        if (stationStatus === 'idle') {
            dispatch(fetchPopularStations());
        }
    }, [busStatus, stationStatus, dispatch])

    return (
        <MainLayout>
            
            <div className="body-main">
                <div className="thumnail-wrapper">
                    <Thumbnail/>
                </div>
                
                <SliderContent
                    title="Nhà xe phổ biến"
                    items={busData}
                    getImageUrl={(item) => item.image}
                    getTitle={(item) => item.company_name}
                    getSubtitle={(item) => item.descriptions}
                />
                
                <AdSlider
                />
                
                <SliderContent
                    title="Bến xe phổ biến"
                    items={stationData}
                    getImageUrl={(item) => item.image} 
                    getTitle={(item) => item.name}
                    getSubtitle={(item) => item.descriptions}
                />

                <h2 className="title-accent">Top Bài viết </h2>   
                <TopReview/>
                

                <h2 className="title-accent" style={{marginTop: 50}}>Nền tảng kết nối người dùng và nhà xe</h2>   
                <div className="claim-section">
                    <div className="claim-item">
                        <div className="claim-card">
                            <img src={icon1} style={{height: "65px"}}/>
                            <div className="claim-info">
                                <h3>ĐÁP ỨNG MỌI NHU CẦU TÌM KIẾM</h3>
                                <p>Với hơn 5000+ tuyến dường và 1500+ nhà xe trên khắp cả nước</p>
                            </div>
                        </div>
                        <div className="claim-card">
                            <img src={icon2} style={{height: "65px"}}/>
                            <div className="claim-info">
                                <h3>ĐẢM BẢO CÓ VÉ</h3>
                                <p>Hoàn ngay 150% nếu không có vé, mang đến hành trình chọn vẹn</p>
                            </div>
                        </div>
                    </div>

                    <div className="claim-item">
                        <div className="claim-card">
                            <img src={icon3} style={{height: "65px"}} />
                            <div className="claim-info">
                                <h3>CAM KẾT GIỮ VẼ</h3>
                                <p>Vivutoday cam kết hoàn 150% nếu nhà xe không giữ vé</p>
                            </div>
                        </div>
                        <div className="claim-card">
                            <img src={icon4} style={{height: "65px"}}/>
                            <div className="claim-info">
                                <h3>TỔNG ĐÀI HỖ TRỢ KHÁCH HÀNG 24/7</h3>
                                <p>Giải quyết kịp thời vấn đề của khách hàng một cách nhanh chóng</p>
                            </div>
                        </div>
                    </div>
                </div>

                <h2 className="title-accent">Nền Tảng Kết Nối Người Dùng Và Nhà Xe</h2>
                
                <div className="prize-wrapper">
                    <div className="prize-section">
                        <div className="prize-list">
                            {[...prize, ...prize].map((item, index) => (
                                <div key={index} className="prize-card">
                                <img src={item.src} alt={item.name} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
            </div>
        </MainLayout>
    )
}