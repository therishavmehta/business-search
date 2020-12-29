import {React} from 'react';
import {Tag} from '../../components'
import './styles.css';

function Filter(props) {
  const { localFilters, setLocalFilters, triggerSearch, triggerFilterRemoval } = props;


  const handleFilter = (key, value) => {
    const priceIndex = localFilters.price.indexOf(value);
    let setAttribute = {};
    if(key === Filter.Type.PRICE && priceIndex === -1) {
      setAttribute = {...localFilters, [key]: [...localFilters.price, value]};
    } else if (localFilters.price.indexOf(value) > -1) {
      const sliced  = localFilters.price.filter(item=>  item != localFilters.price[priceIndex]);
      setAttribute = {...localFilters ,[key]: [...sliced]};
    }
    if(key === Filter.Type.STATUS && value !== localFilters.status[0]) {
      setAttribute = {...localFilters , [key]: [value]};
    } else if(key === Filter.Type.STATUS && value === localFilters.status[0]) {
      setAttribute = {...localFilters, [key]: []};
    }
    setLocalFilters(setAttribute);
  }

  return (
      <div className="filters-container">
        <div className="filter">
          <div className="heading">Price</div>
          <div onClick={e => handleFilter(Filter.Type.PRICE, e.target.id)} className="filter-items">
            <Tag clickTrigger={true} active={localFilters.price} id="$">$</Tag>
            <Tag clickTrigger={true} active={localFilters.price} id="$$">$$</Tag>
            <Tag clickTrigger={true} active={localFilters.price} id="$$$">$$$</Tag>
            <Tag clickTrigger={true} active={localFilters.price} id="$$$$">$$$$</Tag>
          </div>
        </div>
        <div className="filter">
          <div className="heading">Status</div>
          <div onClick={e => handleFilter(Filter.Type.STATUS, e.target.id)}  className="filter-items">
            <Tag clickTrigger={true} active={localFilters.status} id="0">Open</Tag>
            <Tag clickTrigger={true} active={localFilters.status} id="1">Closed</Tag>
          </div>
        </div>
        <button className="search-button" onClick={triggerSearch} style={{alignSelf: 'flex-end', margin: '5px'}}>Apply</button>
        <button className="search-button" 
        onClick={triggerFilterRemoval}
         style={{alignSelf: 'flex-end', margin: '5px'}}>Clear</button>
      </div>
  )
}

Filter.Type = {
  PRICE: 'price',
  STATUS: 'status',
}

export default Filter;
