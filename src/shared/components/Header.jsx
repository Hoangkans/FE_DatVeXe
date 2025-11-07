import { Link } from "react-router-dom"
import logo from "../../assets/logo.png"
import "../styles/Header.css"
import SearchIcon from '@mui/icons-material/Search';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneIcon from '@mui/icons-material/Phone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ResponsiveNav from "./ResponsiveNav";
import SearchBar from "./Search/SearchBar";
import { toast } from "react-toastify";
import { useState } from "react";
import { logOut } from "../../config/redux/reducers/user/userSlice";
import { useSelector, useDispatch } from "react-redux"

export default function Header() {

    const {userInfo} = useSelector((state) => state.user)

    const dispatch = useDispatch();

    const handleLogout = () => {
        try {
            toast.info("You have logout!, login for and specific features!")
            dispatch(logOut())
        }catch(err){
            console.error("Failed to logout", err)
        }
    }

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

                    <p className="just-a-line">|</p>

                    <div className="login-group">
                        <AccountCircleIcon/>
                        {userInfo ? (
                            <div className="user-name">
                                <p>hello, {userInfo.fullName}</p>
                                <button onClick={() => handleLogout()}>Logout</button>
                            </div>
                        ):(
                            <Link to="/login">Login</Link>
                        )}
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