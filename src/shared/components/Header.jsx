import { Link } from "react-router-dom"
import logo from "../../assets/logo.png"
import "../styles/Header.css"
import SearchIcon from '@mui/icons-material/Search';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneIcon from '@mui/icons-material/Phone';

import ResponsiveNav from "./ResponsiveNav";
import SearchBar from "./Search/SearchBar";
import { useState } from "react";

export default function Header() {
    const [openSearch, setOpenSearch] = useState(false)
    const handleOpenSearch = () => setOpenSearch(true)
    const handleCloseSearch = () => setOpenSearch(false)
    return (
        <div className="Header">
            <div className="upHeader">
                <div className="header-name">
                    <DirectionsBusIcon/>
                    <p>Hệ thống đặt vé xe toàn quốc</p>
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
                    <Link to="/">TRANG CHỦ</Link>
                    <Link to="/info">GIỚI THIỆU</Link>
                    <Link to="/book-car">ĐẶT XE</Link>
                    <Link to="/bus-company">THÔNG TIN NHÀ XE</Link>
                    <Link to="/bus-station">BẾN XE</Link>
                    <Link to="/bus-route">TUYẾN ĐƯỜNG</Link>
                    <Link to="/ticket-check">KIỂM TRA VÉ</Link>
                </div>
                <div className="header-search">
                    <SearchIcon
                        onClick = {handleOpenSearch}  
                        sx={{
                            color: 'white', 
                            backgroundColor: '#FFA901',
                            p: 1,
                            borderRadius: 1,

                            '&:hover': {
                                backgroundColor: '#FFBB33',
                                cursor: 'pointer',
                            }
                        }}  
                    />
                </div>
            </div>
            <ResponsiveNav className="naviagtionNav"/>

            <SearchBar
                open={openSearch}
                handleClose={handleCloseSearch}
            />
        </div>
    )
}