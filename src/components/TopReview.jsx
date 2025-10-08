import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import sample from "../assets/sample.png"

import  "../styles/TopReview.css";

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
                }}
            >
                {itemData.map((item) => (
                    <ImageListItem
                        key={item.img}
                        cols={item.cols || 1}
                        rows={item.rows || 1}
                        sx={{ position: 'relative' }}
                    >
                        <img
                            {...srcset(item.img, 150, item.rows, item.cols)}
                                alt={item.title}
                                style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '6px',
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
        img: `${sample}`,
        title: 'Sai Gon',
        description: '287 bai viet',
        rows: 2,
        cols: 2,
    },
    {
        img: `${sample}`,
        title: 'Vung Tau',
        description: '93 bai viet',  
        rows: 2,
        cols: 1,
    },
    {
        img: `${sample}`,
        title: 'Ha Noi',
        description: '612 bai viet',
        cols: 2,
        rows: 2,
    },
    {
        img: `${sample}`,
        title: 'Da Lat',
        description: '87 bai viet',
        rows: 1,
        cols: 1,
    },
    {
        img: `${sample}`,
        title: 'Quy Nhon',
        description: '81 bai viet',
        rows: 1,
        cols: 1,
    },
    {
        img: `${sample}`,
        title: 'Nha Trang',
        description: '557 bai viet',
        rows: 2,
        cols: 2,
    },
    {
        img: `${sample}`,
        title: 'Da Nang',
        description: '570 bai viet',
        rows: 1,
        cols: 1,
    },
    {
        img: `${sample}`,
        title: 'Phan Thiet',
        description: '276 bai viet',
    }
];