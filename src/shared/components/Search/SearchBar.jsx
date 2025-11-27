import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { useRef, useEffect } from 'react';
import "../../styles/SearhBar.css"
import { useNavigate } from 'react-router-dom';

export default function SearchBar ({open, handleClose}) {
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (open) {
            inputRef.current?.focus();
        }
    }, [open]);

    const handleSearch = () => {
        const query = inputRef.current?.value;

        if (query && query.trim() !== "") {
            navigate(`/search-result?q=${encodeURIComponent(query)}`);
            handleClose(); 
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }

    return (
        <div className={`searchbar-overlay ${open ? 'open' : ''}`}>
            <div className='searchbar'>
                <input 
                    ref={inputRef} 
                    type="text" 
                    placeholder='Tìm kiếm ...'
                    onKeyDown={handleKeyDown} 
                />
                {/* Add onClick to icon */}
                <div className="search-icon-wrapper" onClick={handleSearch}> 
                    <SearchIcon />
                </div>
            </div>

            <div className="search-close-wrapper" onClick={handleClose}>
                <CloseIcon />
            </div>
        </div>
    )
}