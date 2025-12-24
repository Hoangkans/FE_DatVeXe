import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../../shared/layouts/MainLayout";
import mascot from "../../assets/mascot.png"

export default function PaymentResultPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState("loading"); 

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const resultCode = params.get("resultCode");

        if (resultCode === "0") {
        setStatus("success");
        } else {
        setStatus("failed");
        }
    }, [location]);

    return (
        <MainLayout>
            <div className="payment-result-container" style={{ textAlign: "center", padding: "50px 20px", backgroundColor: '#ece9ddff'}}>
                
                {status === "loading" && <h3>Đang kiểm tra kết quả thanh toán...</h3>}

                {status === "success" && (
                    <div className="success-box" style={{
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center'
                    }}>
                        <h2 style={{color: 'green'}}>Thanh toán thành công! </h2>
                        <p>Cảm ơn bạn đã đặt vé. Vé điện tử đã được gửi tới email của bạn.</p>
                        <img src={mascot} alt="" />
                        <button className="btn btn--primary" onClick={() => navigate("/booking-history")}>
                            Xem vé của tôi
                        </button>
                    </div>
                )}

                {status === "failed" && (
                    <div className="error-box"style={{
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <h2 style={{color: 'red'}}>Thanh toán thất bại 😞</h2>
                        <p>Giao dịch bị hủy hoặc xảy ra lỗi.</p>
                        <img src={mascot} alt="" />
                        <button className="btn btn--secondary" onClick={() => navigate("/")}>
                            Về trang chủ
                        </button>
                    </div>
                )}

            </div>
        </MainLayout>
    );
}