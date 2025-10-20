
export default function InfoBrand() {
    return (
        <div className="info-brand">
            <h3>Hệ thống đặt vé xe toàn quốc <span style={{color: "#FF8D00"}}>Vivutoday.com</span></h3>
            <p style={{fontSize: 20, lineHeight: 2}}>Trong thời đại số hóa ngày nay, việc sử dụng công nghệ thông tin để giải quyết nhu cầu của cuộc sống trở nên
                quen thuộc. Khi bạn cần tìm một trang web đáng tin cậy để đặt vé xe, VivuToday.com sẽ là người bạn đáng tin
                để giúp bạn di chuyển một cách an toàn và tiện lợi.
            </p>

            <div className="info-box-list">
                <div className="info-box" style={{backgroundColor: "#0094DE"}} >
                    <p>Chúng tôi <strong>cam kết đảm bảo </strong> 
                        cho bạn môi trường đáng tin
                        cậy để đặt vé xe. Với việc
                        kiểm tra độ tin cậy và sự hợp
                        tác với các đối tác uy tín, chúng tôi đảm bảo mỗi chuyến đi của bạn diễn ra 
                        <strong> an toàn và suôn sẻ </strong>
                    </p>
                    <h5>An Toàn Được Đảm Bảo</h5>
                </div>
                <div className="info-box" style={{backgroundColor: "#00B3DB"}}>
                    <p>Với đội ngũ tư vấn viên
                        chuyên nghiệp luôn sẵn sàng <strong>hỗ trợ 24/7</strong>,
                        chúng tôi sẽ giúp bạn mọi lúc bạn cần. Điều này đảm bảo bạn luôn có  
                        <strong> một người bạn đồng hành đáng tin </strong>
                        trong mỗi hành trình.
                    </p>
                    <h5>Hỗ Trợ Tận Tâm</h5>
                </div>
                <div className="info-box" style={{ border: "2px solid #FF8D00"}}>
                    <div className="info-box-achieve">
                        <p style={{color: "#FF8D00"}}><strong>1500+</strong> nhà xe</p>
                        <p style={{color: "#FF8D00"}}><strong>5000+</strong> lịch trình</p>
                    </div>
                    <p style={{color: '#000000'}}>Chúng tôi cung cấp nhiều sự
                        lựa chọn để đáp ứng mọi nhu
                        cầu của khách hàng.
                    </p>
                    <h5 style={{color: "#0094DE"}}>Đa Dạng Sự Lựa Chọn</h5>
                </div>
            </div>
        </div>
    )
}