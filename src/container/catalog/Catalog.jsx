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
    const [data, setRenderData] = useState([]);
    const [filters, setFilters] = useState('');
    const [snackData, setSnackData] = useState(false);
    const [markers, setMarkers] = useState([]);
    const [region, setRegion] = useState({});
    const [mapView, setMapView] = useState(false);


    const newSearch = (query) => {
        if(queries.text !== query) {
            setData(query, '', false);
        }
    }
    /**
     *
     * @param {Object} queries - get data for the queries.
     */
    const setData = (query, pagination, offset=false) => {
        const {token, url} = props;
            setLoadingMore(() => true);
            axios.get(url+query+pagination, {
           headers: {
            Authorization: `Bearer ${token}`
            }
        })
          .then((res) => {
            if(offset) {
                setRenderData([...data, ...res.data.businesses]);
                setMarkers([...markers, ...appendMarkers(res.data.businesses)]);
            } else {
                setRenderData([...res.data.businesses]);
                setMarkers([...appendMarkers(res.data.businesses)]);
            }
            const totalPage = Math.ceil(res.data.total/queries.limit);
            setQueries({...queries, text: query, page:1, totalPage});
            res.data.region.center && setRegion(res.data.region.center);
          })
          .catch((err) => {
            console.error (err);
            setSnackData('Something went wrong!');
          }).finally(() => {
              setLoadingMore(() => false);
              setTimeout(setSnackData(false), 5000);

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
        const reg = /&offset=[1-9]+/gi;
        const pageq = `&offset=${queries.limit*(queries.page+1)}`
        reg.test(queries.text) ? setData(queries.text, api.replace(reg, pageq), true) : 
        setData(queries.text, `&limit:${queries.limit}${pageq}`, true);
        setQueries(({...queries ,page: queries.page+1}));
    }

    /**
     * condition for render loading more
     */
    const shouldLoadMore = () => {
        return queries.totalPage !== queries.page && !isLoadingMore;
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
            {isLoadingMore && <Spinner />}
            {shouldLoadMore() ? <a className="loadMore" onClick={loadMore}>Load more...</a> : null}
            {snackData && <Snackbar text={snackData}/>}
        </div>
    )
}

export default Catalog;
