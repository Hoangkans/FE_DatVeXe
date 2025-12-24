import { scrollReveal } from "../../utils/user/scrollReveal"

import mascot from "../../../assets/mascot.png"
import booking from "../../../assets/mascot-booking.png"

export default function InfoReason() {
    const containerRef = scrollReveal(0.2);

    return (
        <div className="info-brand" ref={containerRef} style={{overflow: 'hidden'}}> 
            <h3 className="reveal-base reveal-fade-up">
                Lý do bạn nên đặt vé tại <span style={{color: "#FF8D00"}}>Vivutoday.com</span>
            </h3>
            <div className="info-reason-wrap">
                
                <div className="reason-box reveal-base reveal-slide-left" style={{'--delay': '0.2s'}}>
                    <div className="reason-box-item">
                        <h5>Tìm Kiếm Thông Tin Một Cách Dễ Dàng</h5>
                        <p>Giao diện của VivuToday.com được thiết kế để giúp bạn tìm kiếm
                            thông tin nhà xe, giờ khởi hành, điểm xuất phát và đích
                            một cách nhanh chóng và dễ dàng.
                        </p>
                    </div>
                    <div className="reason-box-item" style={{marginTop: '20px'}}>
                        <h5>Tùy Chỉnh Theo Tài Chính Của Bạn</h5>
                        <p>Chúng tôi hiểu rằng mỗi hành trình có một ngân
                             sách riêng. Với giao diện của chúng tôi, 
                             bạn có thể tùy chỉnh lựa chọn những nhà xe nằm trong khoảng giá tiền mà bạn mong muốn.
                        </p>
                    </div>
                </div>

                <img src={`${mascot}`} title="vivutoday" className="mascot reveal-base reveal-pop" style={{'--delay': '0.4s'}} />

                <div className="reason-box reveal-base reveal-slide-right" style={{'--delay': '0.6s'}}>
                    <div className="reason-box-item">
                        <h5>Lựa Chọn Nhà Xe Có Đánh Giá Cao</h5>
                        <p>Chất lượng là một yếu tố quan trọng.
                             Trên giao diện của VivuToday.com, bạn có thể
                             chọn lựa những nhà xe được đánh giá cao với
                               mục đánh giá 5 sao.
                        </p>
                    </div>
                    <div className="reason-box-item" style={{marginTop: '20px'}}>
                        <h5>Thanh Toán An Toàn</h5>
                        <p>Việc thanh toán không còn là vấn đề khiến bạn
                             lo lắng. Chúng tôi cung cấp các phương thức
                             thanh toán đa dạng bao gồm thanh toán trực tuyến.
                        </p>
                    </div>
                </div>   

                <div className="mascot-booking reveal-base reveal-fade-up"> 
                    <img src={`${mascot}`} title="vivutoday"/>
                    <img src={`${booking}`} title="booking" className="booking-img" />
                </div>
                         
            </div>
        </div>
    )
}