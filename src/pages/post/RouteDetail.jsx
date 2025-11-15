import { useSelector } from "react-redux"
import MainLayout from "../../shared/layouts/MainLayout"

import sample from "../../assets/image-hodler.png"
import formatMoney from "../../shared/utils/ticket/money"
import "../../shared/styles/BusPage.css"
export default function RouteDetail() {
    const route = useSelector((state) => state.post.selectedPost)

    return (
        <MainLayout>
            <div className="station-detail">
                <div className="station-header"
                    style={{
                        backgroundImage: `url(${route.img || sample})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.52)",
                        backgroundBlendMode: "darken",
                    }}
                >
                    <h2>TUYẾN ĐƯỜNG</h2>
                    <p>From <strong>{route.title}</strong> to <strong>{route.description}</strong></p>
                </div>
                <div className="station-content">
                    <p> <strong>Depart from:</strong> {route.depart}</p>
                    <p><strong>Arrive at:</strong> {route.arrive}</p>
                    <img src={route.img} alt={route.title} />
                    
                    <p><strong>Distance:</strong> {route.distance} km</p>
                    <p><strong>Duration:</strong> {route.duration} minutes</p>
                    <p><strong>Price:</strong> {formatMoney(route.price)} VND</p>
                </div>
            </div>
        </MainLayout>
    )
}