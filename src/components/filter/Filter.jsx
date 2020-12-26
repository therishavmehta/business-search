import {React, useState} from 'react';
import {Tag} from '../../components'
import './styles.css';

function Filter(props) {
  const { filterVal: {price, status, rating}={} } = props;
  const [filters, setFilters] = useState({
    price: price,
    status: status,
    rating: rating
  });

  const handleFilter = (key, value) => {
    setFilters({[key]: value, ...filters});
  }

  const checkFilter = () => {
    const {price: propPrice, status: propStatus, rating: propRating} = props.filterVal;
    const {price: statePrice, status: stateStatus, rating: stateRating} = filters;
    if(propPrice !== statePrice || propStatus !== stateStatus || propRating !== stateRating) {
      //applyFilter(enocode)
    }
  }

  return (
      <div className="filters-container">
        <div className="filter">
          <div className="heading">Price</div>
          <div onClick={e => handleFilter(Filter.Type.PRICE, e.target.id)} className="filter-items">
            <Tag id="$">$</Tag>
            <Tag id="$$">$$</Tag>
            <Tag id="$$$">$$$</Tag>
            <Tag id="$$$$">$$$$</Tag>
          </div>
        </div>
        <div className="filter">
          <div className="heading">Status</div>
          <div onClick={e => handleFilter(Filter.Type.STATUS, e.target.id)}  className="filter-items">
            <Tag id="0">Open</Tag>
            <Tag id="1">Closed</Tag>
          </div>
        </div>
        <div className="filter">
          <div className="heading">{`Rating (<=) `}</div>
          <div onClick={e => handleFilter(Filter.Type.RATING, e.target.id)} className="filter-items">
            <Tag id="1" active={true}>1</Tag>
            <Tag id="2">2</Tag>
            <Tag id="3">3</Tag>
            <Tag id="4">4</Tag>
            <Tag id="5">5</Tag>
          </div>
        </div>
        <button className="search-button" onClick={checkFilter} style={{alignSelf: 'flex-end', margin: '5px'}}>Apply</button>
      </div>
  )
}

Filter.Type = {
  PRICE: 'price',
  STATUS: 'status',
  RATING: 'rating'
}

export default Filter;
