import { React, useState } from 'react';
import { Modal, Filter } from '../../components';
import { geolocated } from "react-geolocated";
import MyLocationIcon from '@material-ui/icons/MyLocation';
import {addFilter, appendFilter, removeFilter} from '../../redux/filter/filter.action';
import {addSearch, appendSearch} from '../../redux/search/search.action';
import { connect } from 'react-redux';
import './styles.css';
import axios from 'axios';
import { addData, removeData } from '../../redux/data/data.action';

function Search(props) {
  const {url, token, coords, isGeolocationAvailable, isGeolocationEnabled,
      search, filters, addData, appendSearch, removeFilter, addFilter, removeData } = props;
  const [toggleLocation, setLocation] = useState(true);
  const [filterModal, setFilterModal] = useState(false);
  const [localQuery, setLocalQuery] = useState(search);
  const [localFilters, setLocalFilters] = useState(filters);
  const [formError, setformError] = useState('');

  //useEffect(() => {
  //  triggerSearch();
  //}, [...paramListener])

    const triggerLocation = () => {
      if(!isGeolocationEnabled) {
          appendSearch({snackbar: 'Please enable location service'});
      } else {
          if(!isGeolocationAvailable) {
              appendSearch({snackbar: 'GeoLocation Not Available. Please try later!'});
          } else {
              const {latitude, longitude} = coords;
              setLocation(() => false);
              appendSearch({latitude, longitude});
          }
      }
      setTimeout(appendSearch({snackbar:false}), 5000); 
    }

    /**
     */
    const triggerSearch = () => {
      const encoded = checkDataAndTrigger();
      let totalPage = -1;
      encoded && appendSearch({isLoading: true});
      encoded && removeData();
      encoded && axios.get(url+encoded, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        addData(res.data);
        totalPage = Math.ceil(res.data.total/search.pagination.limit);

      })
      .catch((err) => {
        console.error (err);
        appendSearch({snackbar: 'Something went wrong!'});
      })
      .finally(() => {
        appendSearch({...localQuery, isLoading: false});
        totalPage > -1 && appendSearch({...localQuery, param: encoded, pagination: {...search.pagination, totalPage}});
        setTimeout(setLocalQuery({...localQuery, snackbar: false}), 5000);
        addFilter(localFilters);
      })
    }

    const triggerFilter = () => {
      setFilterModal(false);
      triggerSearch();
    }

  const searchParam = () => {
    const {bussines='', address='', latitude=0, longitude=0} = localQuery;
    let searchEncoded = '', searchError = 'Please enter the ';
    if(bussines.length) searchEncoded += `term=${bussines}`;
    else searchError += `bussines`;
    if(toggleLocation) {
      if(address.length) searchEncoded += `&location=${address}`
      else searchError += `${searchError.length > 17 ? ' and': ''} address.`;
    } else {
      if(!(longitude && latitude)) searchError += ` latitude and longitude`;
      else searchEncoded += `&latitude=${latitude}&longitude=${longitude}`
    }
    return {
      searchEncoded, searchError
    };
  }


  /**
   * @param {Object} event - event object
   * trigger the new data fetch and update the steps
   */
  const checkDataAndTrigger = () => {
    let encoded = '', error = 'Please enter the ';
    const {searchEncoded, searchError} = searchParam();
    const encodedFilter = encodeFilter();
    encoded = searchEncoded || encoded;
    error = searchError || error;
    if(encodedFilter.length) encoded += encodedFilter;
    if(error.length > 17) {
      setformError(error); 
      return false;
    }
    else {
      setformError('');
      return encodeURI(encoded);
    }
  }

  
  const handleInputChange = (key, event) => {
    event.stopPropagation();
    setLocalQuery({...localQuery, [key]: event.target.value});
  }

  const handleModalClose = () => {
    setFilterModal(false);
    setLocalFilters(filters);
  }

  const triggerFilterRemoval = async () => {
      setLocalFilters(() => ({price: [], status: []}));
      await removeFilter();
      setFilterModal(false);
      triggerSearch();
  }


  const encodeFilter = () => {
    const {price=[], status=[]} = localFilters;
    let priceValue = ''
    price.sort().forEach((item='') => priceValue += item.length && `${item.length},`);
    priceValue = priceValue.slice(0, -1);
    let encoded = '';
    if(price.length) encoded +=  `&price=${priceValue}`;
    if(status.length) encoded += `&open_now=${status[0] === 'Closed' ? false : true}`;
    return encodeURI(encoded);
  }


  const location = (
    <input id="address" type="text" value={localQuery.address} placeholder="Location" autoComplete="off"
     onChange={event => handleInputChange(Search.INPUT.ADDRESS, event)}/>
  );

  const coordinate = (
    <>
      <input id="latitude" type="text" value={localQuery.latitude} placeholder="Latitude" autoComplete="off"
      onChange={event => handleInputChange(Search.INPUT.LATITUDE, event)}/>
      <input id="longitude" type="text" value={localQuery.longitude} placeholder="Longitude" autoComplete="off"
       onChange={event => handleInputChange(Search.INPUT.LONGITUDE, event)}/>
    </>
  )

  return (
    <div className="search-box">
        <div className="compulsary-input">
          <input id="bussines" name="text" type="text" value={localQuery.bussines}
              placeholder="Bussines" autoComplete="off"
              onChange={(event) => handleInputChange(Search.INPUT.BUSSINES, event)} />
              {toggleLocation ? location : coordinate}
              <MyLocationIcon style={{cursor: 'pointer'}} onClick={triggerLocation}/>
        </div>
        <div style={{marginTop: '5px'}}>
          <button className="search-button" style={{marginLeft: '5px'}}
          onClick={triggerSearch}>Go</button>
          <button className="filter-button" onClick={() => setFilterModal(true)}>Filter</button>

        </div>
        <div style={{marginTop: '5px', marginLeft: '5px'}}>

        </div>
        <span className="toggle-button" onClick={() => setLocation(!toggleLocation)}>
              Switch to {toggleLocation ? 'Co-ordinate' : 'Location'}
        </span>
        {formError && <span style={{color: 'red'}}>{formError}</span>}
        { filterModal && <Modal handleClose={handleModalClose} show={filterModal}>
          <Filter localFilters={localFilters} setLocalFilters={setLocalFilters} triggerSearch={triggerFilter}
          triggerFilterRemoval={triggerFilterRemoval}/>
        </Modal>}
    </div>
  );
}

const mapStateToProps = state => ({
  filters: state.filters,
  search: state.search
});

const mapDispatchToProps = (dispatch) => ({
  addData: (data) => dispatch(addData(data)),
  addSearch: (search) => dispatch(addSearch(search)),
  addFilter: (filters) => dispatch(addFilter(filters)),
  appendFilter: (filters) => dispatch(appendFilter(filters)),
  appendSearch: (filters) => dispatch(appendSearch(filters)),
  removeFilter: () => dispatch(removeFilter()),
  removeData: () => dispatch(removeData())
});

export default connect(mapStateToProps, mapDispatchToProps)(geolocated({
  positionOptions: {
      enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(Search));

Search.INPUT = {
  BUSSINES: 'bussines',
  ADDRESS: 'address',
  LATITUDE: 'latitude',
  LONGITUDE: 'longitude'
}
