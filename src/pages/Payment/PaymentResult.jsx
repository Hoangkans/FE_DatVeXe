import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../../shared/layouts/MainLayout";


export default function PaymentResultPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState("loading"); // loading | success | failed

    useEffect(() => {
        // 1. Get Params from URL
        const params = new URLSearchParams(location.search);
        const resultCode = params.get("resultCode");
        const orderInfo = params.get("orderInfo"); // "Thanh toan ve xe TCK..."
        const message = params.get("message");

        // 2. Check MoMo Result Code
        if (resultCode === "0") {
        setStatus("success");
        // Optional: Call your backend here to update status to "PAID" if your backend doesn't use IPN
        } else {
        setStatus("failed");
        }
    }, [location]);

    return (
        <MainLayout>
            <div className="payment-result-container" style={{ textAlign: "center", padding: "50px 20px" }}>
                
                {status === "loading" && <h3>Đang kiểm tra kết quả thanh toán...</h3>}

                {status === "success" && (
                <div className="success-box">
                    <h2 style={{color: 'green'}}>Thanh toán thành công! 🎉</h2>
                    <p>Cảm ơn bạn đã đặt vé. Vé điện tử đã được gửi tới email của bạn.</p>
                    <button className="btn btn--primary" onClick={() => navigate("/booking-history")}>
                        Xem vé của tôi
                    </button>
                </div>
                )}

                {status === "failed" && (
                <div className="error-box">
                    <h2 style={{color: 'red'}}>Thanh toán thất bại 😞</h2>
                    <p>Giao dịch bị hủy hoặc xảy ra lỗi.</p>
                    <button className="btn btn--secondary" onClick={() => navigate("/")}>
                        Về trang chủ
                    </button>
                </div>
                )}

            </div>
        </MainLayout>
    );
}