import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import bg from "../../../assets/thumbnail.png"
import "../../styles/Thumbnail.css"

export default function Thumbnail() {
    return (
        <div className="thumbnail">
            <img src={`${bg}`} className='bgCover'/>
            <form>
                <div className="booking-input">
                    <h4>Diểm khởi hành</h4>
                    <input type="text" placeholder="Chọn điểm khởi hành"/>
                </div>
                <div className="booking-input">
                    <h4>Điểm đến</h4>
                    <input type="text" placeholder="Chọn điểm đến" />
                </div>
                <div className="booking-input">
                    <h4>Ngày khởi hành</h4>
                    <div className='calendar'>
                        <CalendarMonthIcon
                            sx={{
                                color: 'black'
                            }}
                        />
                        <input type="text" placeholder="Chọn điểm đến"/>
                    </div>
                </div>

                <button>
                    <div className='button-wrapper'>
                        <SearchIcon
                            sx={{
                                color: 'white', 
                                p: 1,
                                borderRadius: 1
                            }}    
                        />

                        <p>TÌM CHUYẾN XE</p>
                    </div>
                </button>
            </form>
        </div>
    )
}