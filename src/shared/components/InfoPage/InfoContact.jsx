import { scrollReveal } from "../../utils/user/scrollReveal"

export default function InfoContact() {
    
    const containerRef = scrollReveal(0.2);
    return (
        <div className="info-brand" ref={containerRef}>
            <div className="contact-info-wrapper">
                <div className="contact-info-claim reveal-base reveal-fade-up">
                    <h3>Khách hàng là trung tâm</h3>
                    <p>Chúng tôi luôn đặt “khách hàng là trung tâm” và
                        xem việc làm hài lòng, đáp ứng nhu cầu của khách hàng như mục tiêu
                        hàng đầu.
                    </p>
                    <p>Nếu bạn cần di chuyển đến bất kỳ tỉnh thành nào...</p>
                </div> 

                <div className="Info-form-input">
                    <h3 className="reveal-base reveal-fade-up" style={{'--delay': '0.2s'}}>Liên hệ với chúng tôi</h3>

                    <form action="">
                        <div className="contact-input reveal-base reveal-fade-up" style={{'--delay': '0.3s'}}>
                            <label>Họ Và Tên:</label>
                            <input type="text" />
                        </div>
                        <div className="contact-input reveal-base reveal-fade-up" style={{'--delay': '0.4s'}}>
                            <label>Email:</label>
                            <input type="text" />
                        </div>
                        <div className="contact-input reveal-base reveal-fade-up" style={{'--delay': '0.5s'}}>
                            <label>Số Điện Thoại:</label>
                            <input type="text" />
                        </div>
                        <div className="contact-input reveal-base reveal-fade-up" style={{'--delay': '0.6s'}}>
                            <label>Tin Nhắn:</label>
                            <input type="text" />
                        </div>    
                    </form>

                    <button className="reveal-base reveal-pop" style={{'--delay': '0.8s'}}>
                        Gửi Ngay
                    </button>
                </div> 
            </div>
        </div>
    )
}