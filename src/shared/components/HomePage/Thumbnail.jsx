import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import bg from "../../../assets/thumbnail.png"
import { useEffect, useState } from 'react';
import PlaceSelect from './PlaceSelectment';
import CalendarPicker from './CalendarPick';
import "../../styles/Thumbnail.css"

import locationsPick from "../../../services/bookcar/locations";
export default function Thumbnail() {
    const [date, setDate] = useState();
    const [options, setOptions] = useState([]);


    useEffect(() => {
        const locs = locationsPick; 
        const arr = Array.isArray(locs) ? locs : [];
        const mapped = arr.map((name, idx) => ({ id: idx + 1, destination: String(name) }));
        setOptions(mapped);
    }, []); 

    return (
        <div className="thumbnail">
            <img src={`${bg}`} className='bgCover'/>
            <form>
                <div className="booking-input">
                    <h4>Diểm khởi hành</h4>
                    <div className='select-wrapper'>
                        <PlaceSelect
                            options={options}
                            placeholder='Chọn điểm đi'
                        />
                    </div>
                </div>
                <div className="booking-input">
                    <h4>Điểm đến</h4>
                    <div className='select-wrapper'>
                        <PlaceSelect
                            options={options}
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
