import "../shared/styles/NotFoundPage.css";
import mascot from "../assets/mascot.png";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="not-found-page">
            <div className="back-to-page">
                <h1>404 - PAGE NOT FOUND!</h1>  
                <p>Rất tiếc trang bạn tìm kiếm đang không tồn tại</p> 
                <Link to="/" className="home-btn">Go Back</Link>
            </div>

            <img src={mascot} alt="Mascot" className="mascot-img" />
         </div>
    );
}