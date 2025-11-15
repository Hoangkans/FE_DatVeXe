import { useSelector } from "react-redux"
import MainLayout from "../../shared/layouts/MainLayout"

export default function CompanyDetail() {
    const company = useSelector ((state) => state.post.selectedPost)
    return (
        <MainLayout>
            <div className="station-detail">
                <div className="station-header"
                    style={{
                        backgroundImage: `url(${company.img})`,
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.52)",
                        backgroundBlendMode: "darken",
                    }}
                >
                    <h2>NHÀ XE</h2>
                    <h2>{company.title}</h2>
                </div>
                <div className="station-content">
                    <p>{company.title}</p>
                    <p>{company.description}</p>
                    <img src={company.img} alt={company.title} />
                    <p>{company.description}</p>
                </div>
            </div>
        </MainLayout>
    )
}