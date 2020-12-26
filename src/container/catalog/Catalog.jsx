import { React, useEffect, useState } from 'react';
import { Card, Spinner, Search, Map, Snackbar } from '../../components';
import {Link} from 'react-router-dom';
//import { connect } from 'react-redux';
// import { appendItem, addItem, intialiseData } from '../../redux/anime/anime.actions';
import './styles.css';
import { geolocated } from "react-geolocated";
import axios from 'axios';

/**
 * Prepares the catlog of anime category
 */
function Catalog(props) {
    const { url, coords, isGeolocationEnabled, isGeolocationAvailable } = props;
    const [queries, setQueries] = useState({
        text: '',
        limit: 20,
        totalPage: 1,
        page: 1
    });
    
    const [isLoadingMore, setLoadingMore] = useState(false);
    const [api, setApi] = useState('');
    const [data, setData] = useState([]);
    const [param, setParam] = useState('');
    const [filters, setFilters] = useState('');
    const [snackData, setSnackData] = useState(false);
    const [markers, setMarkers] = useState([]);
    const [region, setRegion] = useState({});

    useEffect(() => {
        api.length && getData();
        console.log(coords, isGeolocationAvailable, isGeolocationEnabled);
    }, [api]);


    const filterApi = (param, query) => {
            const {token} = props;
            setLoadingMore(() => true);
            axios.get(`${'https://cors-anywhere.herokuapp.com/'}https://api.yelp.com/v3/businesses/search?${query}`, {
           headers: {
            Authorization: `Bearer ${token}`
            }
        })
          .then((res) => {
            console.log(res.data);
            setData([...data, res.data.businesses]);
            const totalPage = res.data.total/queries.limit;
            setQueries({...queries, totalPage});
          })
          .catch((err) => {
          console.log (err);
          }).finally(() => {
              setLoadingMore(() => false);
          })
    }

    const newSearch = (query) => {
        if(queries.text !== query) {
            setQueries({text: query, page:1, ...queries});
            setApi(url+query);
        }
    }

    const applyFilter =(query) => {
        if(filters !== query) {
            setQueries({page: 1, ...queries});
            setFilters(query)
            setApi(api+query);
       }
    }

    const getMarkers = (items) => {
        let node = [];
        items.forEach((item) => {
            node.push(item);
        });
        setMarkers([...markers, node]);
    }

    /**
     *
     * @param {Object} queries - get data for the queries.
     */
    const getData = () => {
        const {token} = props;
            setLoadingMore(() => true);
            axios.get(api, {
           headers: {
            Authorization: `Bearer ${token}`
            }
        })
          .then((res) => {
            setData([...data, ...res.data.businesses]);
            const totalPage = res.data.total/queries.limit;
            queries.totalPage !== totalPage && setQueries({...queries, totalPage});
          })
          .catch((err) => {
          console.log (err);
          setSnackData('Something went wrong!');
          }).finally(() => {
              setLoadingMore(() => false);
              setTimeout(setSnackData(false), 0);

          })
            //const notSensitiveText = text.toLowerCase();
            //const query = `${uri}/search/${topic}?q=${notSensitiveText}&limit=${limit}&page=${page}`;
            //setApi(() => (`${uri}/search/${topic}?q=${notSensitiveText}`));
            //const getResponse = await fetch(query);
            //const response = await getResponse.json();
            ////prepareFilter(response);
            //return response;x`
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
        list.length && list.forEach((bussines={}) => {
            const {id, ...otherProps} = bussines;
            cards.push(
                <Link to={`/bussines/${id}`} params={id}>
            <Card id={id} key={id} {...otherProps}/>
            </Link>);
        });
        return cards;
    }

    /**
     * update query with page
     */
    const loadMore = () => {
        const reg = /offset=[1-9]+/gi;
        const pageq = `offset=${queries.limit*queries.page}`
        setQueries(({page=1, ...otherProps}) => ({page: page+1, ...otherProps}));
        reg.test(api) ? setApi(api.replace(reg, pageq)) : setApi(api+`limit:${queries.limit}&${pageq}`);

    }

    /**
     * condition for render loading more
     */
    const shouldLoadMore = () => {
        return queries.totalPage !== queries.page && !isLoadingMore && api.length;
    }

    const redirectPage = (event) => {};

    return (
        <div className="catalog-container">
            <Search style={{display: 'block', transition: 'top 0.3s'}} triggerApi={newSearch}/>
            <div className="card-content">
                {getCardInstance(data)}
            </div>
            {isLoadingMore && api.length && <Spinner />}
            {shouldLoadMore() ? <a className="loadMore" onClick={loadMore}>Load more...</a> : null}
            {snackData && <Snackbar text={snackData}/>}
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

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
})(Catalog);

Catalog.filters = ["categories", "price", "is_claimed", "is_closed"]

/** Use for prepared data
 * const prepareFilter = (datas) => {
        let filterData = new Map();
        datas.forEach((data, idx) => {
            Catalog.filters.forEach((item) => {
                if(data.hasOwnProperty(item)) {
                    let prevItems, newData;
                    if(typeof data[item] === 'string') {
                      prevItems = filterData.get(item) || {};
                      newData = Object.keys(prevItems).includes(data[item]) ? 
                                [...prevItems[data[item]], idx] : [idx];
                      prevItems[data[item]] = newData;
                      filterData.set(item, prevItems);
                    } else if(Array.isArray(data[item]) && item === 'categories') {
                        data[item].forEach((category) => {
                           const {alias, title} = category;
                           prevItems = filterData.get(item) || {};
                           newData = Object.keys(prevItems).includes(title) ?
                                      [...prevItems[title], idx] : [idx];
                           prevItems[title] = newData;
                           filterData.set(item, prevItems); 
                        })
                                    
                    } else if(typeof data[item] === 'boolean') {
                        prevItems = filterData.get(item) || {};
                        const values = data[item] ? item.substring(3) : 'Not '+item.substring(3);
                        newData = Object.keys(prevItems).includes(values) ?
                                    [...prevItems[values], idx] : [idx];
                        prevItems[values] = newData;
                        filterData.set(item, prevItems);
                    }                                      
                }
            });
        });
        return filterData;
    }
 */
