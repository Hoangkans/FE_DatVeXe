import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { useRef, useEffect } from 'react';
import "../../styles/SearhBar.css"

export default function SearchBar ({open, handleClose}) {
    const inputRef = useRef (null)

    useEffect(() => {
        if (open) {
            inputRef.current?.focus();
        }
    }, [open])
    return (
        <div className={`searchbar-overlay ${open ? 'open' : ''}`}>
            <div className='searchbar'>
                <input 
                    ref={inputRef} 
                    type="text" 
                    placeholder='Tìm kiếm ...'
                />
                <div className="search-icon-wrapper">
                    <SearchIcon />
                </div>
            </div>

            <div className="search-close-wrapper" onClick={handleClose}>
                <CloseIcon />
            </div>
        </div>
    )
}

