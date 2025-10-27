import MainLayout from "../shared/layouts/MainLayout"
import "../shared/styles/TicketCheck.css"
import contact from "../assets/hotline-bookcar.jpg"

export default function TicketCheck() {
    return (
        <MainLayout>
            <div className="ticket-check-wrapper">
                <div className="check-overlay">
                    <div className="form-input-wrapper">
                        <div className="form-input">
                            <h2>Nhập thông tin vé xe</h2>
                            <form>
                                <input type="text" placeholder="Mã Vé" required/>
                                <input type="text" placeholder="Số điện thoại (Bắt Buộc)" required/>
                                <button>Kiểm tra vé</button>
                            </form>
                        </div>

                        <div className="caution">
                            <h5>Lưu ý:</h5>
                            <p>Trường hợp bạn không thể hủy vé qua mạng
                                hoặc muốn đổi sang đơn hàng khác vui lòng liên hệ
                                chúng tôi qua số điện thoại <strong>1900 7070 hoặc
                                1900969681</strong>
                            </p>
                        </div>
                    </div>

                    <div className="check-result">
                        <p>Vui lòng nhập vào thông tin và bấm kiểm tra vé</p>
                        <img src={contact}  />
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}