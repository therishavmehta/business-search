import { React, useLayoutEffect, useState } from 'react';
import { Card, Spinner, Search } from '../../components';
//import { connect } from 'react-redux';
// import { appendItem, addItem, intialiseData } from '../../redux/anime/anime.actions';
import {sample} from '../../data';
import './styles.css';

/**
 * Prepares the catlog of anime category
 */
function Catalog(props) {
    console.log(sample);
    const { uri, topic, anime, appendData, intialiseData } = props;
    const [queries, setQueries] = useState({
        text: '',
        limit: 16,
        page: 1,
    });
    
    const [isLoadingMore, setLoadingMore] = useState(false);
    const [api, setApi] = useState('');
    const [ lastPage, setLastPage ] = useState(0);

    useLayoutEffect(() => {
        //(function() {
        //    if (queries.text.length) {
        //        getCards();
        //    }
        //})();
        // queries.page, queries.text, uri, topic
    }, []);

    /**
     *
     * @param {Object} queries - get data for the queries.
     */
    const getData = async (queries) => {
        const {text='', limit, page=1 } = queries;
        try {
            setLoadingMore(() => true);
            const notSensitiveText = text.toLowerCase();
            const query = `${uri}/search/${topic}?q=${notSensitiveText}&limit=${limit}&page=${page}`;
            setApi(() => (`${uri}/search/${topic}?q=${notSensitiveText}`));
            const getResponse = await fetch(query);
            const response = await getResponse.json();
            return response;
        } catch(error) {
            throw error;
        } finally {
            setLoadingMore(false);
        }
    }

    /**
     * append cards
     */
    const getCards = async () => {
        //const { results, last_page } = await getData(queries);
        //if(lastPage !== last_page) {
        //    setLastPage(last_page);
        //}
        //if(results.length) {
        //    results.length && appendData(results);
        //}
    }

    /**
     *
     * @param {Array} list - list of cards
     * create react node and saves it in the state
     */
    const getCardInstance = (list=[]) => {
        const cards = [];
        list.length && list.forEach((bussines) => {
            const {id, ...otherProps} = bussines;
            cards.push(<Card key={id} {...otherProps}/>)
        });
        return cards;
    }

    /**
     * update query with page
     */
    const loadMore = () => {
        //setQueries(({page=1, ...otherProps}) => ({page: page+1, ...otherProps}));
    }

    /**
     * condition for render loading more
     */
    const shouldLoadMore = () => {
        //return lastPage !== queries.page && !isLoadingMore && anime.length;
    }

    return (
        <div className="catalog-container">
            <Search />
            <div style={{alignSelf: 'left'}}>
                <span className="requesting">Requesting: </span>
                <span className="api-text">{api || 'API Request URL will appear here'}</span>
            </div>
            <div className="card-content" onClick={(event) => console.log(event)}>
                {getCardInstance(sample.businesses)}
            </div>
            {isLoadingMore && <Spinner />}
            {shouldLoadMore() ? <a className="loadMore" onClick={loadMore}>Load more...</a> : null}
        </div>
    )
}

//const mapStateToProps = state => ({
//    anime: state.animeReducer.currentAnime
//});

//const mapDispatchToProps = dispatch => ({
//    setNewData: anime => dispatch(addItem(anime)),
//    appendData: anime => dispatch(appendItem(anime)),
//    intialiseData: anime => dispatch(intialiseData())
//})

export default Catalog;