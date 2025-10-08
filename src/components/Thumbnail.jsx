import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import bg from "../assets/thumbnail.png"
import "../styles/Thumbnail.css"

export default function Thumbnail() {
    return (
        <div className="thumbnail" style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
        }}>
            <form>
                <div className="booking-input">
                    <h4>Diem khoi hanh</h4>
                    <input type="text" placeholder="Chon diem khoi hanh"/>
                </div>
                <div className="booking-input">
                    <h4>Diem den</h4>
                    <input type="text" placeholder="Chon diem den" />
                </div>
                <div className="booking-input">
                    <h4>Ngay khoi hanh</h4>
                    <div className='calendar'>
                        <CalendarMonthIcon
                            sx={{
                                color: 'black'
                            }}
                        />
                        <input type="text" placeholder="Chon diem den"/>
                    </div>
                </div>

                <button>
                    <SearchIcon
                        sx={{
                            color: 'white', 
                            p: 1,
                            borderRadius: 1
                        }}    
                    />

                    <p>TIM CHUYEN XE</p>
                </button>
            </form>
        </div>
    )
}