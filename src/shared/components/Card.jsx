import "../styles/Card.css"
export default function Card({title, description, image}) {
    return (
        <div className="card">
            <img src={image} alt={title} />
            <div className="card-info">
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
        </div>
    )
}