import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"; 
import MainLayout from "../shared/layouts/MainLayout";
import Card from "../shared/components/Card";
import { fetchAllArticle } from "../services/post/post";
import { Grid } from "@mui/material";
import "../shared/styles/SearhBar.css";

export default function SearchResult() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const navigate = useNavigate(); 

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);

    const normalizeText = (str) => {
        if (!str) return "";
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove accents
    };

    useEffect(() => {
        if (query) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const response = await fetchAllArticle();
                    const allData = response.data || response; 

                    const filteredData = allData.filter((item) => {
                        const normalizedTitle = normalizeText(item.title);
                        const normalizedQuery = normalizeText(query);
                        return normalizedTitle.includes(normalizedQuery);
                    });

                    setArticles(filteredData);

                } catch (error) {
                    console.error("Failed to fetch articles:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [query]);

    return (
        <MainLayout>
            <div className="search-result-wrapper">
                <div className="search-result" style={{ padding: "20px" }}>
                    <h2 className="result-content" style={{ marginBottom: "20px" }}>
                        Ket qua tim kiems: {query}
                    </h2>

                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div className="result-list">
                            {articles.length > 0 ? (
                                <Grid 
                                    container 
                                    spacing={4} 
                                    justifyContent="center" 
                                    sx={{
                                        maxWidth: "1500px", 
                                        margin: "0 auto",
                                    }}
                                >
                                    {articles.map((item) => (
                                        <Grid item xs={12} sm={6} md={3} key={item.id || item._id}>
                                            <div
                                                onClick={() => viewMore(item)}
                                                className="article-card-wrapper"
                                                style={{
                                                    cursor: "pointer",
                                                    transition: "transform 0.2s ease",
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                                            >
                                                <Card
                                                    title={item.title}
                                                    image={item.image}
                                                />
                                            </div>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <p className="text-gray-500 text-center mt-4">No articles found.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    )
}