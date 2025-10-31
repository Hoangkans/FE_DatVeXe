import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import bg from "../../../assets/thumbnail.png"
import { useEffect, useState } from 'react';
// Local stub to keep component working after removing services
const getLocations = async () => [];
import PlaceSelect from './PlaceSelectment';
import CalendarPicker from './CalendarPick';
import "../../styles/Thumbnail.css"

export default function Thumbnail() {
    const [date, setDate] = useState();
    const [options, setOptions] = useState([]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const locs = await getLocations();
                const arr = Array.isArray(locs) ? locs : [];
                const mapped = arr.map((name, idx) => ({ id: idx + 1, destination: String(name) }));
                if (mounted) setOptions(mapped);
            } catch (e) {
                if (mounted) setOptions([]);
            }
        })();
        return () => { mounted = false };
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
