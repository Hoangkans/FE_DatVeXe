import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import hanoi from "../../../assets/post/hanoi.png";
import saigon from "../../../assets/post/saigon.png";
import danang from "../../../assets/post/danang.png";
import dalat from "../../../assets/post/dalat.png";
import nhatrang from "../../../assets/post/nhatrang.png";
import vungtau from "../../../assets/post/vungtau.png";
import quynhon from "../../../assets/post/quynhon.png";
import phanthiet from "../../../assets/post/phanthiet.png";
import "../../styles/TopReview.css";

import { useNavigate } from 'react-router-dom';

function srcset(image, size, rows = 1, cols = 1) {
    return {
        src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
        srcSet: `${image}?w=${size * cols}&h=${
            size * rows
        }&fit=crop&auto=format&dpr=2 2x`,
    };
}

export default function TopReview() {
    // 1. Initialize the hook
    const navigate = useNavigate();

    // 2. Update function to accept the location name directly
    const handleSearch = (locationTitle) => {
        if (locationTitle) {
            // Encode URI component handles spaces (e.g., "Ha Noi" -> "Ha%20Noi")
            navigate(`/search-result?q=${encodeURIComponent(locationTitle)}`);
        }
    };

    return (
        <div className='top-review'>
            <ImageList
                variant="quilted"
                cols={3}
                rowHeight={150}
                sx={{
                    width: '80%',
                    height: 'auto',
                    overflow: 'hidden',
                    maxWidth: '1100px',
                }}
            >
                {itemData.map((item, index) => (
                    <ImageListItem
                        // 3. FIX: 'onClick' (CamelCase)
                        // 4. FIX: Use arrow function () => to prevent immediate execution
                        onClick={() => handleSearch(item.title)}
                        key={`${item.img}-${index}`}
                        cols={item.cols || 1}
                        rows={item.rows || 1}
                        sx={{ 
                            position: 'relative',
                            transition: 'transform 0.3s ease',
                            '&:hover': {   
                                cursor: 'pointer',
                                transform: 'scale(1.02)', // Optional: adds a nice zoom effect
                                zIndex: 1
                            },
                        }}
                    >
                        <img
                            {...srcset(item.img, 150, item.rows, item.cols)}
                            alt={item.title}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                        <div className="overlay">
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </div>
                    </ImageListItem>
                ))}
            </ImageList>
        </div>
    );
}

const itemData = [
    {
        img: saigon, // Removed template literals `${}` as they are unnecessary for imports
        title: 'Sài Gòn',
        description: 'Thành phố không ngủ',
        rows: 2,
        cols: 2,
    },
    {
        img: vungtau,
        title: 'Vũng Tàu',
        description: 'Thiên đường biển gần Sài Gòn',
        rows: 2,
        cols: 1,
    },
    {
        img: hanoi,
        title: 'Hà Nội',
        description: 'Thủ đô nghìn năm văn hiến',
        cols: 2,
        rows: 2,
    },
    {
        img: dalat,
        title: 'Đà Lạt',
        description: 'Thành phố ngàn hoa',
        rows: 1,
        cols: 1,
    },
    {
        img: quynhon,
        title: 'Quy Nhơn',
        description: 'Xứ biển bình yên',
        rows: 1,
        cols: 1,
    },
    {
        img: nhatrang,
        title: 'Nha Trang',
        description: 'Thiên đường du lịch biển',
        rows: 2,
        cols: 2,
    },
    {
        img: danang,
        title: 'Đà Nẵng',
        description: 'Thành phố đáng sống',
        rows: 1,
        cols: 1,
    },
    {
        img: phanthiet,
        title: 'Phan Thiết',
        description: 'Thủ phủ resort miền Trung',
    }
];