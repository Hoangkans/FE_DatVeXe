import { useSelector } from "react-redux"
import MainLayout from "../../shared/layouts/MainLayout"

export default function CompanyDetail() {
    const company = useSelector ((state) => state.post.selectedPost)
    return (
        <MainLayout>
            <div className="station-detail">
                <div className="station-header"
                    style={{
                        backgroundImage: `url(${company.wallpaper})`,
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
                    <div 
                        className="article-content"
                        style={{maxWidth: 1100, textAlign: 'justify'}}
                        dangerouslySetInnerHTML={{ __html: company.content }} 
                    />
                </div>
            </div>
        </MainLayout>
    )
}