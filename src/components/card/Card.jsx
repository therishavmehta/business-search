import { React } from 'react';
import './styles.css';

/**
 *
 * @param {Object} props - properties which are passed.
 * gets the required item for the card and return the structured node
 */
function Card({ image_url, alias, url }) {

    /**
     *
     * @param {String} url - url to open
     * opens url in new tab
     */
    const openCardInNewTab = (url) => {
        window.open(url, "_blank");
    }

    return (
        <a className="card" onClick={() => openCardInNewTab(url)}>
            <div className="card-image">
                <img src={image_url} alt={alias} />
            </div>
            <div className="card-name">
                <h4>{alias}</h4>
            </div>
        </a>
    )
}

export default Card;
