import { React, useState } from 'react';
import {Modal, Filter} from '../../components';
import './styles.css';

function Search(props) {
  const {triggerApi} = props;
  const [inputValue, setInputValue] = useState({
    bussines: '',
    address: '',
    latitude: '',
    longitude: ''
  });
  const [formError, setformError] = useState(false);
  const [toggleLocation, setLocation] = useState(true);
  const [filterModal, setFilterModal] = useState(false);

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

  const checkLocation = (value) => {
    const reg = '^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$';
    return reg.test(Number(value));
  }


    /**
     * @param {Object} event - event object
     * trigger the new data fetch and update the steps
     */
    const checkDataAndTrigger = async (event) => {
      const {bussines, address, latitude, longitude} = inputValue;
      let encoded = '', error = 'Please enter the ';
      if(bussines.length) encoded += `term=${bussines}`;
      else error += `bussines`;
      if(toggleLocation) {
        if(address) encoded += `location=${address}`
        else error += `${error.length > 17 ? ' and': ''} address.`;
      } else {
        if(!(longitude && latitude)) error += ` latitude and longitude`;
        else encoded += `latitude=${latitude}&longitude=${longitude}`
      }
      encoded += toggleLocation ? `location=${address}` : `latitude=${latitude}&longitude=${longitude}`; 
      if(error.length > 17) setformError(error) 
      else {
        triggerApi(encodeURI(`term=${bussines}&location=${address}`));
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



  return (
    <div className="search-box">
        <div className="compulsary-input">
          <input id="bussines" name="text" type="text" value={inputValue.bussines}
              placeholder="Bussines" autoComplete="off"
              onChange={(event) => handleInputChange(Search.INPUT.BUSSINES, event)} onKeyDown={event => triggerEvent(event)}/>
              {toggleLocation ? location : coordinate}
        </div>
        <div style={{marginTop: '5px', marginLeft: '5px'}}>
          <button className="search-button" onClick={(event) => checkDataAndTrigger(event)}>Go</button>
          <button className="search-button" onClick={() => setFilterModal(true)}>Filter</button>
        </div>
        <span className="toggle-button" onClick={() => setLocation(!toggleLocation)}>
              Switch to {toggleLocation ? 'Co-ordinate' : 'Location'}
        </span>
        {formError && <span style={{color: 'red'}}>{formError}</span>}
        { filterModal && <Modal handleClose={handleModalClose} show={filterModal}>
          <Filter />
        </Modal>}
    </div>
  );
}

export default Search;

Search.INPUT = {
  BUSSINES: 'bussines',
  ADDRESS: 'address',
  LATITUDE: 'latitude',
  LONGITUDE: 'longitude'
}
