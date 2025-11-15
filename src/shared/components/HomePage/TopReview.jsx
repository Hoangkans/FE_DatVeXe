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
import  "../../styles/TopReview.css";

function srcset(image, size, rows = 1, cols = 1) {
    return {
        src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
        srcSet: `${image}?w=${size * cols}&h=${
        size * rows
        }&fit=crop&auto=format&dpr=2 2x`,
    };
}

export default function TopReview() {
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
                        key={`${item.img}-${index}`}
                        cols={item.cols || 1}
                        rows={item.rows || 1}
                        sx={{ 
                            position: 'relative',
                            transition: 'transform 0.3s ease',
                            '&:hover': {   
                                cursor: 'pointer',
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
    )
}

const itemData = [
    {
        img: `${saigon}`,
        title: 'Sai Gon',
        description: '287 bai viet',
        rows: 2,
        cols: 2,
    },
    {
        img: `${vungtau}`,
        title: 'Vung Tau',
        description: '93 bai viet',  
        rows: 2,
        cols: 1,
    },
    {
        img: `${hanoi}`,
        title: 'Ha Noi',
        description: '612 bai viet',
        cols: 2,
        rows: 2,
    },
    {
        img: `${dalat}`,
        title: 'Da Lat',
        description: '87 bai viet',
        rows: 1,
        cols: 1,
    },
    {
        img: `${quynhon}`,
        title: 'Quy Nhon',
        description: '81 bai viet',
        rows: 1,
        cols: 1,
    },
    {
        img: `${nhatrang}`,
        title: 'Nha Trang',
        description: '557 bai viet',
        rows: 2,
        cols: 2,
    },
    {
        img: `${danang}`,
        title: 'Da Nang',
        description: '570 bai viet',
        rows: 1,
        cols: 1,
    },
    {
        img: `${phanthiet}`,
        title: 'Phan Thiet',
        description: '276 bai viet',
    }
];