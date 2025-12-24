import { useSelector } from "react-redux"
import MainLayout from "../../shared/layouts/MainLayout"

import sample from "../../assets/image-hodler.png"
import "../../shared/styles/BusPage.css"
export default function RouteDetail() {
    const route = useSelector((state) => state.post.selectedPost)

    return (
        <MainLayout>
            <div className="station-detail">
                <div className="station-header"
                    style={{
                        backgroundImage: `url(${route.wallpaper || sample})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.52)",
                        backgroundBlendMode: "darken",
                    }}
                >
                    <h2>TUYẾN ĐƯỜNG</h2>
                    <p> <strong>{route.title}</strong>  <strong>{route.description}</strong></p>
                </div>
                <div className="station-content">
                    <div 
                        className="article-content"
                        style={{maxWidth: 1100, textAlign: 'justify'}}
                        dangerouslySetInnerHTML={{ __html: route.content }} 
                    />
                </div>
            </div>
        </MainLayout>
    )
}