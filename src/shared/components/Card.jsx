
import "../styles/Card.css"

function stripHtmlAndLimit(text, limit = 30) {
    const clean = text.replace(/<[^>]+>/g, '');
    const words = clean.split(' ');

    if (words.length <= limit) return clean;

    return words.slice(0, limit).join(' ') + '...';
}

export default function Card({ title, description, image }) {
    const shortDesc = stripHtmlAndLimit(description, 40); 
    return (
        <div className="card">
            <img src={image} alt={title} />
            
            <div className="card-info" >
                <h2 >{title}</h2>
                <p>{shortDesc}</p>
            </div>
        </div>
    );
}