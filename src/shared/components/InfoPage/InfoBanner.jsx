import bg from "../../../assets/thumbnail2nd.png"
import logo from "../../../assets/logo.png"
import fb from "../../../assets/brand/facebook.png"
import zl from "../../../assets/brand/zalo.png"
import { Link } from "react-router-dom"

export default function InfoBanner(){
    return (
        <div className="info-banner">
            <img src={`${bg}`} className='bgCover'/>
            <div className="banner-info">
                <div className="banner-claim">
                    <p>Tiện lợi,</p>
                    <p>tận tâm,</p>
                    <p style={{color: "#0094DE"}}>an toàn.</p>
                </div>
                <div className="banner-info-link">
                    <p>Theo dõi chúng tôi tại:</p>
                    <div className="banner-info-link-image">
                        <Link to="https://vivutoday.com/">
                            <img src={`${logo}`} title="ivutoday.com"/>
                        </Link>
                        <Link>
                            <img src={`${fb}`} title="facebook"/>
                        </Link>
                        <Link>
                            <img src={`${zl}`} title="zalo"/>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}