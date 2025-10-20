import mascot from "../../../assets/mascot.png"
import booking from "../../../assets/mascot-booking.png"
export default function InfoReason() {
    return (
        <div className="info-brand">
            <h3>Lý do bạn nên đặt vé tại <span style={{color: "#FF8D00"}}>Vivutoday.com</span></h3>
            <div className="info-reason-wrap">
                <div className="reason-box">
                    <div className="reason-box-item">
                        <h5>Tìm Kiếm Thông Tin Một Cách Dễ Dàng</h5>
                        <p>Giao diện của VivuToday.com được thiết kế để giúp bạn tìm kiếm
                            thông tin nhà xe, giờ khởi hành, điểm xuất phát và đích
                            một cách nhanh chóng và dễ dàng.
                            Thông qua việc nhập các thông tin cơ bản, bạn có thể tìm kiếm lịch trình phù hợp chỉ trong vài giây. 
                        </p>
                    </div>
                    <div className="reason-box-item">
                        <h5>Tùy Chỉnh Theo Tài Chính Của Bạn</h5>
                        <p>Chúng tôi hiểu rằng mỗi hành trình có một ngân
                             sách riêng. Với giao diện của chúng tôi, 
                             bạn có thể tùy chỉnh lựa chọn những nhà xe nằm trong khoảng giá tiền mà bạn mong muốn. Điều này giúp bạn tiết kiệm thời gian và tìm được các lựa chọn phù hợp với túi tiền.
                        </p>
                    </div>
                </div>

                <img src={`${mascot}`} title="vivutoday" className="mascot" />

                <div className="reason-box">
                    <div className="reason-box-item">
                        <h5>Lựa Chọn Nhà Xe Có Đánh Giá Cao</h5>
                        <p>Chất lượng là một yếu tố quan trọng.
                             Trên giao diện của VivuToday.com, bạn có thể
                              chọn lựa những nhà xe được đánh giá cao với
                               mục đánh giá 5 sao. Điều này đảm bảo rằng bạn đang chọn một dịch vụ uy tín và chất lượng cho hành trình của mình.
                        </p>
                    </div>
                    <div className="reason-box-item">
                        <h5>Thanh Toán An Toàn</h5>
                        <p>Việc thanh toán không còn là vấn đề khiến bạn
                             lo lắng. Chúng tôi cung cấp các phương thức
                              thanh toán đa dạng bao gồm thanh toán trực tuyến, qua ngân hàng và epays.
                               Đảm bảo bạn có sự linh hoạt trong việc chọn phương thức phù hợp với bạn và đảm bảo tính an toàn cho giao dịch.
                        </p>
                    </div>
                </div>   

                <div className="mascot-booking"> 
                    <img src={`${mascot}`} title="vivutoday"/>
                    <img src={`${booking}`} title="booking" className="booking-img" />
                </div>
                         
            </div>
        </div>
    )
}