import { useSelector } from "react-redux";
import MainLayout from "../../shared/layouts/MainLayout";

export default function StationDetail() {
    const station = useSelector((state) => state.post.selectedPost);

    return (
        <MainLayout>
            <div className="station-detail">
                <div className="station-header"
                    style={{
                        backgroundImage: `url(${station.img})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                    }}
                >
                    <h2>BẾN XE</h2>
                    <h2>{station.title}</h2>
                </div>
                <div className="station-content">
                    <img src={station.img} alt={station.title} />
                    <p>{station.description}</p>
                </div>
            </div>
        </MainLayout>
    );
}
