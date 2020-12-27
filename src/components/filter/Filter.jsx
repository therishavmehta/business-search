import {React, useState} from 'react';
import {Tag} from '../../components'
import './styles.css';

function Filter(props) {
  const { presentFilter: {price, status, rating}={}, applyFilter } = props;
  const [filters, setFilters] = useState({
    price: [...price],
    status: [...status],
  });

  const handleFilter = (key, value) => {
    const priceIndex = filters.price.indexOf(value);
    if(key === Filter.Type.PRICE && priceIndex === -1) {
      setFilters({...filters, [key]: [...filters.price, value]});
    } else if (filters.price.indexOf(value) > -1) {
      const sliced  = filters.price.filter(item=>  item != filters.price[priceIndex]);
      setFilters({...filters, [key]: [...sliced]});
    }
    if(key === Filter.Type.STATUS && value !== filters.status[0]) {
      setFilters({...filters, [key]: [value]});
    } else if(key === Filter.Type.STATUS && value === filters.status[0]) {
      setFilters({...filters, [key]: []});
    }
  }

  const checkFilter = () => {
    const {price: statePrice, status: stateStatus} = filters;
    let priceValue = ''
    statePrice.sort().forEach((item='') => priceValue += item.length && `${item.length},`);
    priceValue = priceValue.slice(0, -1);
    let encoded = '';
    if(statePrice.length) encoded +=  `&price=${priceValue}`;
    if(stateStatus.length) encoded += `&open_now=${stateStatus[0] === 'Closed' ? false : true}`;

    applyFilter(encodeURI(encoded), filters);
  }

  return (
      <div className="filters-container">
        <div className="filter">
          <div className="heading">Price</div>
          <div onClick={e => handleFilter(Filter.Type.PRICE, e.target.id)} className="filter-items">
            <Tag clickTrigger={true} active={filters.price} id="$">$</Tag>
            <Tag clickTrigger={true} active={filters.price} id="$$">$$</Tag>
            <Tag clickTrigger={true} active={filters.price} id="$$$">$$$</Tag>
            <Tag clickTrigger={true} active={filters.price} id="$$$$">$$$$</Tag>
          </div>
        </div>
        <div className="filter">
          <div className="heading">Status</div>
          <div onClick={e => handleFilter(Filter.Type.STATUS, e.target.id)}  className="filter-items">
            <Tag clickTrigger={true} active={filters.status} id="0">Open</Tag>
            <Tag clickTrigger={true} active={filters.status} id="1">Closed</Tag>
          </div>
        </div>
        <button className="search-button" onClick={checkFilter} style={{alignSelf: 'flex-end', margin: '5px'}}>Apply</button>
        <button className="search-button" 
        onClick={() => applyFilter('', {price: '', status: ''})}
         style={{alignSelf: 'flex-end', margin: '5px'}}>Clear</button>
      </div>
  )
}

Filter.Type = {
  PRICE: 'price',
  STATUS: 'status',
  RATING: 'rating'
}

export default Filter;
