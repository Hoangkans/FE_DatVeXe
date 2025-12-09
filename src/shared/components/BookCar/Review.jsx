export default function Review(props) {
    const {
        reviewerName = "",
        rating = 0,
        date = "",
        review = "",
    } = props || {};  

    return (
        <div className="review">
            <p>Review{review}</p>
        </div>
    )
}