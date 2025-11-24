import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import bg from "../../../assets/thumbnail.png"
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"
import PlaceSelect from './PlaceSelectment';
import CalendarPicker from './CalendarPick';
import "../../styles/Thumbnail.css"
import formatDate from "../../utils/date/date"
import locationsPick from "../../../services/bookcar/locations";

export default function Thumbnail() {
    const [date, setDate] = useState(null); 
    const [options, setOptions] = useState([]);
    const navigate = useNavigate();

    const [fromLocation, setFromLocation] = useState(""); 
    const [toLocation, setToLocation] = useState("");

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const locs = await locationsPick; 
                const arr = Array.isArray(locs) ? locs : [];
                const mapped = arr.map((name, idx) => ({ 
                    id: idx + 1, 
                    destination: String(name),
                    label: String(name)
                }));
                setOptions(mapped);
            } catch (error) {
                console.error("Failed to load locations", error);
                setOptions([]);
            }
        };
        fetchOptions();
    }, []); 

    const onPlaceChange = (event, newValue, type) => {
        const data = newValue || event; 

        const text = data?.destination || data?.label || data || "";

        if (type === 'from') setFromLocation(text);
        if (type === 'to') setToLocation(text);
    };

    const handleSearchClick = (e) => {
        e.preventDefault(); 
        
        let dateString = "";
        if (date) {
            const formatted = formatDate(date);
            dateString = formatted.replace(/\//g, "-");
        }

        const encodedFrom = encodeURIComponent(fromLocation);
        const encodedTo = encodeURIComponent(toLocation);

        navigate(`/book-car?from=${encodedFrom}&to=${encodedTo}&date=${dateString}`);
    };

    return (
        <div className="thumbnail">
            <img src={`${bg}`} className='bgCover' alt="Background"/>
            <form>
                <div className="booking-input">
                    <h4>Điểm khởi hành</h4>
                    <div className='select-wrapper'>
                        <PlaceSelect
                            options={options}
                            placeholder='Chọn điểm đi'
                            onChange={(event, newValue) => onPlaceChange(event, newValue, 'from')}
                        />
                    </div>
                </div>
                <div className="booking-input">
                    <h4>Điểm đến</h4>
                    <div className='select-wrapper'>
                        <PlaceSelect
                            options={options}
                            placeholder="Chọn điểm đến"
                            onChange={(event, newValue) => onPlaceChange(event, newValue, 'to')}
                        />
                    </div>
                </div>
                
                <div className="booking-input">
                    <h4>Ngày khởi hành</h4>
                    <div className='calendar'>
                        <CalendarMonthIcon sx={{ color: 'black' }} />
                        <CalendarPicker 
                            value={date || null} 
                            onChange={(d) => setDate(d)}
                            slotProps={{ textField: { placeholder: "Chọn ngày" } }}
                        />
                    </div>
                </div>

                <button className='button-date' onClick={handleSearchClick}>
                    <div className='button-wrapper'>
                        <SearchIcon sx={{ color: 'white', borderRadius: 1 }} />
                        <p>TÌM CHUYẾN XE</p>
                    </div>
                </button>
            </form>
        </div>
    )
}