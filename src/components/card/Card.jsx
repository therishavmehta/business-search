import { React } from 'react';
import './styles.css';

/**
 *
 * @param {Object} props - properties which are passed.
 * gets the required item for the card and return the structured node
 */
function Card({ image_url, alias,name, rating, price,phone, display_phone, url, id }) {

    /**
     *
     * @param {String} url - url to open
     * opens url in new tab
     */
    const openCardInNewTab = (url) => {
        window.open(url, "_blank");
    }

    return (
        <a id={id}  className="card">
            <div className="card-image">
                <img id={id} src={image_url} alt={alias} />
            </div>
            <div className="card-name">
                Name: {name}<br />
                Rating: {rating}/5<br />
                Phone: <a href={`tel:${phone}`} target="_blank">{display_phone}</a><br />
                Price: {price}
            </div>
        </a>
    )
}

export default Card;
