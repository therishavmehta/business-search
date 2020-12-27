import { React, useEffect, useState } from 'react';
import { Card, Spinner, Search, Map, Snackbar, Modal } from '../../components';
import {Link} from 'react-router-dom';
import './styles.css';
import axios from 'axios';

/**
 * Prepares the catlog of anime category
 */
function Catalog(props) {
    const { url } = props;
    const [queries, setQueries] = useState({
        text: '',
        limit: 20,
        totalPage: 1,
        page: 1
    });
    
    const [isLoadingMore, setLoadingMore] = useState(false);
    const [api, setApi] = useState('');
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState('');
    const [snackData, setSnackData] = useState(false);
    const [markers, setMarkers] = useState([]);
    const [region, setRegion] = useState({});
    const [mapView, setMapView] = useState(false);

    useEffect(() => {
        api.length && getData();
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
            setMarkers([...markers, ...appendMarkers(res.data.businesses)]);
            res.data.region.center && setRegion(res.data.region.center);
          })
          .catch((err) => {
          console.log (err);
          setSnackData('Something went wrong!');
          }).finally(() => {
              setLoadingMore(() => false);
              setTimeout(setSnackData(false), 0);

          })
    }

    const appendMarkers = (datas) => {
        let nodes = [];
        datas.forEach((data) => {
            data["coordinates"] && nodes.push(data["coordinates"])
        });
        return nodes;
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

    const renderMap = () => {
        return (
            <Modal handleClose={() => setMapView(false)} show={mapView}>
                <Map region={region} coordinates={markers} />
            </Modal>
        )
    }


    return (
        <div className="catalog-container">
            <Search style={{display: 'block', transition: 'top 0.3s'}} triggerApi={newSearch}/>
            {data.length ? <h2 style={{cursor: 'pointer'}} onClick={() => setMapView(!mapView)}>Map View</h2> : null}
            {mapView && renderMap()}
            <div className="card-content">
                {getCardInstance(data)}
            </div>
            {isLoadingMore && api.length && <Spinner />}
            {shouldLoadMore() ? <a className="loadMore" onClick={loadMore}>Load more...</a> : null}
            {snackData && <Snackbar text={snackData}/>}
        </div>
    )
}

export default Catalog;
