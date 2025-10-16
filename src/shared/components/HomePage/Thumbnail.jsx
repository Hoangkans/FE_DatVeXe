import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import bg from "../../../assets/thumbnail.png"
import { routeData } from "../../../services/Datamock/bookingData"
import PlaceSelect from './PlaceSelectment';
import CalendarPicker from './CalendarPick';
import "../../styles/Thumbnail.css"
import { useState } from 'react';

export default function Thumbnail() {
    const [date, setDate] = useState();

    return (
        <div className="thumbnail">
            <img src={`${bg}`} className='bgCover'/>
            <form>
                <div className="booking-input">
                    <h4>Diểm khởi hành</h4>
                    <div className='select-wrapper'>
                        <PlaceSelect
                            options={routeData}
                            placeholder='Chọn điểm đi'
                        />
                    </div>
                </div>
                <div className="booking-input">
                    <h4>Điểm đến</h4>
                    <div className='select-wrapper'>
                        <PlaceSelect
                            options={routeData}
                            placeholder="Chọn điểm đến"
                        />
                    </div>
                </div>
                <div className="booking-input">
                    <h4>Ngày khởi hành</h4>
                    <div className='calendar'>
                        <CalendarMonthIcon
                            sx={{
                                color: 'black'
                            }}
                        />
                        <CalendarPicker value={date} onChange={(d) => setDate(d)} />
                    </div>
                </div>

                <button className='button-date'>
                    <div className='button-wrapper'>
                        <SearchIcon
                            sx={{
                                color: 'white', 
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