import { React, useState } from 'react';
import { Card, Spinner, Search, Map, Snackbar, Modal } from '../../components';
import {Link} from 'react-router-dom';
import './styles.css';
import { connect } from 'react-redux';
import {appendData} from '../../redux/data/data.action';
import {appendSearch} from '../../redux/search/search.action';
import axios from 'axios';

/**
 * Prepares the catlog of anime category
 */
function Catalog(props) {
    const { url, token, businesses=[], markers=[], region={},
            pagination={}, search: {isLoading=false, snackbar=''},
            appendData, appendSearch } = props;
    const [mapView, setMapView] = useState(false);

    /**
     *
     * @param {Array} list - list of cards
     * create react node and saves it in the state
     */
    const getCardInstance = (list=[]) => {
        const cards = [];
        list.length && list.forEach((businesses={}) => {
            const {id, ...otherProps} = businesses;
            cards.push(
                <Link key={id} to={`/businesses/${id}`} params={id}>
            <Card id={id} key={id} {...otherProps}/>
            </Link>);
        });

        return cards;
    }

    /**
     * update query with page
     */
    const loadMore = () => {
       const encodedUri = encodedPagination();
       appendSearch({isLoading: true});
       axios.get(url+encodedUri, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        appendData(res.data);
        appendSearch({pagination: {...pagination, page: pagination.page+1}});
      })
      .catch((err) => {
        console.error (err);
        appendSearch({snackbar: 'Something went wrong!'});
      })
      .finally(() => {
        appendSearch({isLoading: false});
      })
    }

    const encodedPagination = () => {
        const {page, limit} = pagination;
        const str = `${props.search.param}&limit=${limit}&offset=${limit*(page+1)}`;
        return encodeURI(str);
    }

    /**
     * condition for render loading more
     */
    const shouldLoadMore = () => {
        const {page, totalPage} = pagination;
        return page !== totalPage && !isLoading;
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
            <Search style={{display: 'block', transition: 'top 0.3s'}} url={url} token={token}/>
            {businesses.length ? <h2 style={{cursor: 'pointer'}} onClick={() => setMapView(!mapView)}>Map View</h2> : null}
            {mapView && renderMap()}
            <div className="card-content">
                {getCardInstance(businesses)}
            </div>
            {isLoading && <Spinner />}
            {shouldLoadMore() ? <a className="loadMore" onClick={loadMore}>Load more...</a> : null}
            {snackbar && <Snackbar text={snackbar}/>}
        </div>
    )
}

const mapStateToProps = state => ({
        businesses: state.data.businesses,
        markers: state.data.markers,
        region: state.data.region,
        pagination: state.search.pagination,
        search: state.search
  });

const mapDispatchToProps = (dispatch) => ({
    appendData: (data) => dispatch(appendData(data)),
    appendSearch: (pagination) => dispatch(appendSearch(pagination)),
});


export default connect(mapStateToProps, mapDispatchToProps)(Catalog);
