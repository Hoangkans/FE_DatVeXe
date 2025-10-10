import { Grid} from "@mui/material";
import { Link } from "react-router-dom";
import ncsc from "../../assets/verify/ncsc.png";
import dmca from "../../assets/verify/dmca.png";

import "../styles/Footer.css";

export default function Footer() {
  return (
    <div className="footer">
        <div className="footer-content">
         
            <Grid container spacing={4}>
                <Grid item xs={12} md={4} style={{ minWidth: 470 }}>
                    <h3>Tin tức</h3>
                    <Link to="#">Xe Limousine – Đẳng cấp hạng thương gia thời đại mới</Link>
                    <Link to="#">Tổng quan các bến xe Vũng Tàu – Giới thiệu thông tin lịch trình nhà xe</Link>
                    <Link to="#">Top 31 nhà xe limousine, xe giường nằm đi Đà Lạt</Link>
                </Grid>

                <Grid item xs={12} md={4} >
                    <h3>Tuyến đường</h3>
                    <Link to="#">Xe đi Buôn Mê Thuột từ Sài Gòn</Link>
                    <Link to="#">Xe đi Vũng Tàu từ Sài Gòn</Link>
                    <Link to="#">Xe đi Nha Trang từ Sài Gòn</Link>
                    <Link to="#">Xe đi Đà Lạt từ Sài Gòn</Link>
                    <Link to="#">Xe đi Sapa từ Hà Nội</Link>
                    <Link to="#">Xe đi Hải Phòng từ Hà Nội</Link>
                    <Link to="#">Xe đi Vinh từ Hà Nội</Link>
                </Grid>

                <Grid item xs={12} md={4} style={{ maxWidth: 250 }}>
                    <h3>Xe Limousine</h3>
                    <Link to="#">Xe Limousine đi Đà Lạt từ Sài Gòn</Link>
                    <Link to="#">Xe Limousine đi Vũng Tàu từ Sài Gòn</Link>
                    <Link to="#">Xe Limousine đi Nha Trang từ Sài Gòn</Link>
                    <Link to="#">Xe Limousine đi Hải Phòng từ Hà Nội</Link>
                    <Link to="#">Xe Limousine đi Hạ Long từ Hà Nội</Link>
                    <Link to="#">Xe Limousine đi Sapa từ Hà Nội</Link>
                    <Link to="#">Xe Limousine đi Quảng Ninh từ Hà Nội</Link>
                </Grid>
            </Grid>

                
            <Grid container spacing={8} style={{ marginTop: 20 }}>
                <Grid item xs={12} md={3}>
                    <h3>Bến xe</h3>
                    <Link to="#">Bến xe Miền Đông</Link>
                    <Link to="#">Bến xe Trung tâm Đà Nẵng</Link>
                    <Link to="#">Bến xe Gia Lâm</Link>
                    <Link to="#">Bến xe Mỹ Đình</Link>
                    <Link to="#">Bến xe An Sương</Link>
                    <Link to="#">Bến xe Nước Ngầm</Link>
                    <Link to="#">Bến xe Miền Tây</Link>
                </Grid>

                <Grid item xs={12} md={3} style={{ minWidth: 200 }}>
                    <h3>Nhà xe</h3>
                    <Link to="#">Xe Sao Việt</Link>
                    <Link to="#">Xe Hoa Mai</Link>
                    <Link to="#">Xe Hạ Long Travel</Link>
                    <Link to="#">Xe Quốc Đạt</Link>
                    <Link to="#">Xe Thiện Thành Limousine</Link>
                    <Link to="#">Xe Hồng Sơn Phú Yên</Link>
                    <Link to="#">Xe Tiến Oanh</Link>
                </Grid>

                <Grid item xs={12} md={3} style={{ minWidth: 150 }}>
                    <h3> </h3>
                    <Link to="#">Xe Hải Âu</Link>
                    <Link to="#">Xe Chín Nghĩa</Link>
                    <Link to="#">Xe Kumho</Link>
                    <Link to="#">Xe Tuấn Hưng</Link>
                    <Link to="#">Xe Khanh Phong</Link>
                    <Link to="#">Xe Anh Quốc</Link>
                    <Link to="#">Xe Mỹ Linh</Link>
                </Grid>

                <Grid item xs={12} md={3}>
                    <h3> </h3>
                    <Link to="#">Xe Văn Minh</Link>
                    <Link to="#">Xe An Tuyên</Link>
                    <Link to="#">Xe Nam Á</Link>
                    <Link to="#">Xe Ngọc Anh Sài Gòn</Link>
                    <Link to="#">Xe Hùng Cường</Link>
                    <Link to="#">Xe Thuận Tiến</Link>
                </Grid>
            </Grid>

                
            <Grid container spacing={10} style={{ marginTop: 20 }}>
                <Grid item xs={12} md={3} style={{ minWidth: 150 }}>
                    <h3>Về Chúng Tôi</h3>
                    <Link to="#">Giới Thiệu Vivotoday</Link>
                    <Link to="#">Liên Hệ</Link>
                    <Link to="#">Giá trị cốt lõi</Link>
                </Grid>

                <Grid item xs={12} md={3}  style={{ maxWidth: 200 }}>
                    <h3>Hỗ Trợ</h3>
                    <Link to="#">Chính sách bảo mật</Link>
                    <Link to="#">Chính sách điều khoản và giao dịch chung</Link>
                    <Link to="#">Chính sách đổi trả và hoàn tiền</Link>
                    <Link to="#">Chính sách thanh toán</Link>
                    <Link to="#">Quy chế hoạt động</Link>
                </Grid>

                <Grid item xs={12} md={3} style={{ maxWidth: 200 }}>
                    <h3>Liên hệ</h3>
                    <p>Hotline: <b>1900 0152</b> (Cước phí: 3.000 đ/phút)</p>
                    <p>Hotline: <b>1900.996.678</b> (Cước phí: 1.000 đ/phút)</p>
                    <p>Hotline: <b>1900.0179</b> (Cước phí: 8.000 đ/phút, dịch vụ đặt vé 24/7)</p>
                </Grid>

                <Grid item xs={12} md={3} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <h3>Chứng nhận</h3>
                    <img src={ncsc} alt="ncsc" style={{ height: 50 }} />
                    <img src={dmca} alt="dmca" style={{ height: 50 }} />
                </Grid>
            </Grid>
        </div>
</div>

  );
}
