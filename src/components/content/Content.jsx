import {React, Suspense, useEffect, useState} from 'react';
//import openLink from '../../../public/open-link.png';
//<img src={openLink} onClick={() => openNewTab(url)}/>
import './styles.css';
import {Tag, Modal, Spinner, Map} from '../../components';
import axios from 'axios';
import {withRouter} from 'react-router';
import {Icon} from 'semantic-ui-react'
function Content(props) {
    const { token='', match:{params: {busid}={}}={}, mapToken=''} = props;
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [mapViewPort, setMapViewPort] = useState({
      latitude: 25.0960742,
      longitude: 85.31311939999999,
      heigth: '100vh',
      width: '100vw',
      zoom: 10
    })
    const openNewTab = (link) => {
      window.open(link, '_blank');
    }

    useEffect(() => {
      (function() {
        setLoading(true);
        axios.get(`${'https://cors-anywhere.herokuapp.com/'}https://api.yelp.com/v3/businesses/${busid}`, {
           headers: {
            Authorization: `Bearer ${token}`
            }
        })
          .then((res) => {
            setData(res.data);
          })
          .catch((err) => {
          console.log ('error')
          }).finally(() => setLoading(false));
      })();

    }, []);

    const {name='', image_url='', categories=[], review_count=0, display_phone=0, url='',
    is_claimed=false, is_closed=true, rating=0, location: {address1='', address2='', address3='', 
    city='', state='', country='', zip_code=0}={}, coordinates={}, photos='', hours=[], phone=0
    , alias, special_hours, price} = data;

    const bussinesPhotos = (photos=[]) => {
      let node = [];
      photos && photos.forEach((item) => {
        node.push(<img style={{height: '200px', width: '200px'}} src={item} alt={'No Avatar'} />)
      });
      return node;
    }

    const timing = (times=[]) => {
      const node = [];
      const arr = times.filter(time => time["open"]);
      arr.length && arr[0].open.forEach(item => {
        const {is_overnight, start, end, day} = item;
          node.push(
            <div key={`${start}${end}${day}`} className="special-hours">
                    <h3>{Content.DAYS[day]}</h3>
                    <h3>{`${start.substring(0,2)}:${start.substring(2)}`}</h3>
                    <h3>{`${end.substring(0,2)}:${end.substring(2)}`}</h3>
                    <h3>{`${is_overnight == true ? 'Yes' : '-'}`}</h3>
            </div>
          );
      });
      return node;
    }

    const getTags = (categories=[]) => {
      let node = [];
      categories && categories.forEach(category => {
        node.push(<Tag>{category.title}</Tag>);
      });
      return node;
    }

    const specialHours = (special=[]) => {
      let node = [];
      special && special.forEach((item) => {
        const {is_overnight, start, end, date, is_closed} = item;
        node.push(<div key={date} style={{textAlign: 'left'}} className="special-hours">
                    <h3>{date}</h3>
                    <h3>{`${is_closed ? 'Closed' : 'Open'}`}</h3>
                    <h3>{`${start === null ? '-' : `${start.substring(0,2)}:${start.substring(2)}`}`}</h3>
                    <h3>{`${end === null ? '-' : `${end.substring(0,2)}:${end.substring(2)}`}`}</h3>
                    <h3>{`${is_overnight == true ? 'Yes' : '-'}`}</h3>
                  </div>);
      });
      return node;
    }
    return (
        <div className="row">
                {loading ? 
          <Spinner /> :
          <div className="leftcolumn">
            <div className="container-header">
              <div >
                <img style={{height: '300px', width: '250px'}} src={image_url} alt={alias} />
              </div>
              <div className="container">
                <div className="title-container" >
                  <h2 onClick={() => openNewTab(url)} style={{cursor: 'pointer'}}>{name}</h2><span className={is_closed ? 'red-dot' : 'green-dot'} ></span>
                </div>
                {getTags(categories)}
                <div>
                  <h3>{`${is_claimed ? 'Claimed': 'Not Claimed'}`}</h3>
                </div>
                  <h3>Rating: {rating}/5     {`(${review_count})`}</h3>
                <h3>Price: {price}</h3>
                <h3 >Phone: <a className="text" href={`tel:${phone}`}>{display_phone}</a></h3>
            </div>
          </div>
          <h2>{photos.length ? 'Photos': ''}</h2>
            <div className="bussines-photos">
              {bussinesPhotos(photos)}
            </div>
          <div className="timing-container">
            <div className="hours-container">
                <h2>Timing</h2>
                    <div className="heading-table">
                      <span>Day</span>
                      <span>Start</span>
                      <span>End</span>
                      <span>Over-night</span>
                    </div>
                    {timing(hours)}
                  </div>
              <div className="hours-container">
                <h2>Special Hours</h2>
                    <div className="heading-table">
                      <span>Date</span>
                      <span>Status</span>
                      <span>Start</span>
                      <span>End</span>
                      <span>Over-night</span>
                    </div>
                    {specialHours(special_hours)}
              </div>
            </div>
            <div className="address">
              <h2>Address</h2>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <div>
                <div style={{textAlign: 'center', maxWidth: '200px'}}>
                  <h4>{`${address1},  ${address2}`}</h4>
                  <h4>{`${city},  ${state},`}</h4>
                  <h4>{`${country}-${zip_code}`}</h4>
                </div>
                <div style={{height: '400px', width: '500px'}}>
                  <Map region={coordinates} coordinates={[coordinates]}/>
                </div>
                </div>
              </div>
            </div>
          </div>}
        </div>

    );
}

export default withRouter(Content);

Content.DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

