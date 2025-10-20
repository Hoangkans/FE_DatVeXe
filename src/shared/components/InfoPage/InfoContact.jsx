export default function InfoContact() {
    return (
        <div className="info-brand">
            <div className="contact-info-wrapper">
                <div className="contact-info-claim">
                    <h3>Khách hàng là trung tâm</h3>
                    <p>Chúng tôi luôn đặt “khách hàng là trung tâm” và
                        xem việc làm hài lòng, đáp ứng nhu cầu của khách hàng như mục tiêu
                        hàng đầu. Chúng tôi lắng nghe và tiếp thu những đóng góp quý báu từ khách hàng, để không
                        ngừng hoàn thiện, đổi mới và cung cấp dịch vụ ngày càng tốt hơn.
                    </p>

                    <p>Nếu bạn cần di chuyển đến bất kỳ tỉnh thành
                         nào trong cả nước, hãy đến với vivutoday.com
                          để trải nghiệm những tiện ích tuyệt vời mà hệ thống của chúng tôi mang lại.
                    </p>
                </div> 

                <div className="Info-form-input">
                    <h3>Liên hệ với chúng tôi</h3>

                    <form action="">
                        <div className="contact-input">
                            <label>Họ Và Tên:</label>
                            <input type="text" />
                        </div>
                        <div className="contact-input">
                            <label>Email:</label>
                            <input type="text" />
                        </div>
                        <div className="contact-input">
                            <label>Số Điện Thoại:</label>
                            <input type="text" />
                        </div>
                        <div className="contact-input">
                            <label>Tin Nhắn:</label>
                            <input type="text" />
                        </div>    
                    </form>

                    <button>
                        Gửi Ngay
                    </button>
                </div> 
            </div>
        </div>
    )
}