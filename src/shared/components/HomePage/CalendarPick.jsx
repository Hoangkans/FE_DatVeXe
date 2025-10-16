import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';

export default function CalendarPicker({ value: propValue, onChange }) {
    const [value, setValue] = useState(propValue ?? dayjs());
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);

    useEffect(() => {
        if (propValue) setValue(propValue);
    }, [propValue]);

    useEffect(() => {
        function handleDocClick(e) {
            if (!rootRef.current) return;
            if (!rootRef.current.contains(e.target)) {
                setOpen(false);
            }
        }

        if (open) document.addEventListener('mousedown', handleDocClick);
        return () => document.removeEventListener('mousedown', handleDocClick);
    }, [open]);

    function handleSelect(newValue) {
        setValue(newValue);
        setOpen(false);
        if (onChange) onChange(newValue);
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div ref={rootRef} className="calendar-root">
                <input
                    className="calendar-input"
                    type="text"
                    value={value ? dayjs(value).format('YYYY-MM-DD') : ''}
                    onClick={() => setOpen((s) => !s)}
                    aria-haspopup="dialog"
                    aria-expanded={open}
                />

                {open && (
                    <div className="calendar-popup">
                        <DateCalendar
                            views={['year', 'month', 'day']}
                            value={value}
                            onChange={handleSelect}
                            minDate={dayjs().startOf('day')}
                        />
                    </div>
                )}
            </div>
        </LocalizationProvider>
    );
}