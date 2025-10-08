import { Link } from "react-router-dom"
import logo from "../assets/logo.png"
import "../styles/Header.css"
import SearchIcon from '@mui/icons-material/Search';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneIcon from '@mui/icons-material/Phone';

import ResponsiveNav from "./ResponsiveNav";

export default function Header() {

    return (
        <div className="Header">
            <div className="upHeader">
                <div className="header-name">
                    <DirectionsBusIcon/>
                    <p>He thong dat ve xe toan quoc</p>
                </div>
                <div className="header-contact">
                    <div className="icon-group">
                        <EmailOutlinedIcon/>
                        <p>info.vivutoday@gmail.com</p>
                    </div>
                    
                    <p>|</p>

                    <div className="icon-group">
                        <PhoneIcon/>
                        <p>19000152</p>
                    </div>
                </div>
            </div>

            <div className="header-nav">
                <Link to="/" className="logo">
                    <img src={logo}/>
                </Link>
                <div className="navigation">
                    <Link>TRANG CHU</Link>
                    <Link>GIOI THIEU</Link>
                    <Link>THONG TIN NHA XE</Link>
                    <Link>BEN XE</Link>
                    <Link>TUYEN DUONG</Link>
                    <Link>KIEM TRA VE</Link>
                </div>
                <div className="header-search">
                    <SearchIcon  
                        sx={{
                            color: 'white', 
                            backgroundColor: '#FFA901',
                            p: 1,
                            borderRadius: 1
                        }}
                    />
                </div>
            </div>
            <ResponsiveNav/>
        </div>
    )
}