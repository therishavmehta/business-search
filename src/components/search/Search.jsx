import { React, useState } from 'react';
import {Modal, Filter, Snackbar} from '../../components';
import { geolocated } from "react-geolocated";
import MyLocationIcon from '@material-ui/icons/MyLocation';
import './styles.css';

function Search(props) {
  const {triggerApi, coords, isGeolocationAvailable, isGeolocationEnabled, classView} = props;
  const [inputValue, setInputValue] = useState({
    bussines: '',
    address: '',
    latitude: '',
    longitude: ''
  });
  const [formError, setformError] = useState(false);
  const [toggleLocation, setLocation] = useState(true);
  const [filterModal, setFilterModal] = useState(false);
  const [snackData, setSnackData] = useState(false);
  const [filterData, setFilterData] = useState({
    price: '',
    status: '',
  });
  const [encodedFilter, setEncodedFilter] = useState('');

  /**
     *
     * @param {Object} event - event object
     * trigger data fetch when enter is captured in input
     */
    const triggerEvent = (event) => {
      //if (event.key === 'Enter') {
      //    getNewData(event);
      //}
  }

  const triggerLocation = () => {
    if(!isGeolocationEnabled) {
        setSnackData('Please enable location service');
    } else {
        if(!isGeolocationAvailable) {
            setSnackData('GeoLocation Not Available. Please try later!');
        } else {
            const {latitude, longitude} = coords;
            setLocation(() => false);
            setInputValue({ ...inputValue, latitude, longitude});
        }
    }
    setTimeout(setSnackData(false), 5000); 
}

  const checkLocation = (value) => {
    const reg = '^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$';
    return reg.test(value);
  }


    /**
     * @param {Object} event - event object
     * trigger the new data fetch and update the steps
     */
    const checkDataAndTrigger =async (inputValue={}, encodedFilter='') => {
      const {bussines='', address='', latitude=0, longitude=0} = inputValue;
      let encoded = '', error = 'Please enter the ';
      if(bussines.length) encoded += `term=${bussines}`;
      else error += `bussines`;
      if(toggleLocation) {
        if(address.length) encoded += `&location=${address}`
        else error += `${error.length > 17 ? ' and': ''} address.`;
      } else {
        if(!(longitude && latitude)) error += ` latitude and longitude`;
        else encoded += `&latitude=${latitude}&longitude=${longitude}`
      }
      if(encodedFilter.length) encoded += encodedFilter;
      if(error.length > 17) {
        setformError(error); 
        return false;
      }
      else {
        triggerApi(encodeURI(encoded));
        setformError('');
      }
  }

  
  const handleInputChange = (key, event) => {
    event.stopPropagation();
    setInputValue({ ...inputValue, [key]: event.target.value});
  }

  const location = (
    <input id="address" type="text" value={inputValue.address} placeholder="Location" autoComplete="off"
     onChange={event => handleInputChange(Search.INPUT.ADDRESS, event)}/>
  );

  const coordinate = (
    <>
      <input id="latitude" type="text" value={inputValue.latitude} placeholder="Latitude" autoComplete="off"
      onChange={event => handleInputChange(Search.INPUT.LATITUDE, event)}/>
      <input id="longitude" type="text" value={inputValue.longitude} placeholder="Longitude" autoComplete="off"
       onChange={event => handleInputChange(Search.INPUT.LONGITUDE, event)}/>
    </>
  )

  const handleModalClose = () => {
    setFilterModal(false);
  }

  const addFilterData = async (encoded, filters) => {
    if(encodedFilter !== encoded)  {
      setEncodedFilter(() => (encoded));
      setFilterData(() => ({...filters}));
      await checkDataAndTrigger(inputValue, encoded);
    }
    setFilterModal(false);
  }

  return (
    <div className="search-box">
        <div className="compulsary-input">
          <input id="bussines" name="text" type="text" value={inputValue.bussines}
              placeholder="Bussines" autoComplete="off"
              onChange={(event) => handleInputChange(Search.INPUT.BUSSINES, event)} />
              {toggleLocation ? location : coordinate}
              <MyLocationIcon style={{cursor: 'pointer'}} onClick={triggerLocation}/>
        </div>
        <div style={{marginTop: '5px'}}>
          <button className="search-button" style={{marginLeft: '5px'}} onClick={() => checkDataAndTrigger(inputValue, filterData)}>Go</button>
          <button className="filter-button" onClick={() => setFilterModal(true)}>Filter</button>

        </div>
        <div style={{marginTop: '5px', marginLeft: '5px'}}>

        </div>
        <span className="toggle-button" onClick={() => setLocation(!toggleLocation)}>
              Switch to {toggleLocation ? 'Co-ordinate' : 'Location'}
        </span>
        {formError && <span style={{color: 'red'}}>{formError}</span>}
        { filterModal && <Modal handleClose={handleModalClose} show={filterModal}>
          <Filter applyFilter={addFilterData} presentFilter={filterData}/>
        </Modal>}
        {snackData && <Snackbar text={snackData}/>}
    </div>
  );
}

export default geolocated({
  positionOptions: {
      enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(Search);

Search.INPUT = {
  BUSSINES: 'bussines',
  ADDRESS: 'address',
  LATITUDE: 'latitude',
  LONGITUDE: 'longitude'
}
