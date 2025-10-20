import { useSelector } from "react-redux"
import MainLayout from "../../shared/layouts/MainLayout"

import "../../shared/styles/BusPage.css"
export default function RouteDetail() {
    const route = useSelector((state) => state.post.selectedPost)

    return (
        <MainLayout>
            <div className="station-detail">
                <div className="station-header"
                    style={{
                        backgroundImage: `url(${route.img})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                    }}
                >
                    <h2>TUYẾN ĐƯỜNG</h2>
                    <h2>{route.title}</h2>
                </div>
                <div className="station-content">
                    <img src={route.img} alt={route.title} />
                    <p>{route.description}</p>
                </div>
            </div>
        </MainLayout>
    )
}