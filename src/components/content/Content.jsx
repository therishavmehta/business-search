import {React} from 'react';
//import openLink from '../../../public/open-link.png';
//<img src={openLink} onClick={() => openNewTab(url)}/>
import './styles.css';

function Content(props) {
  const {name='', image_url='', categories=[], review_count=0, display_phone=0, url='',
    is_claimed=false, is_closed=true, rating=0, location={}, coordinates={}, photos='', hours=[], phone=0
    , alias, special_hours, price} = props;

    const openNewTab = (link) => {
      window.open(link, '_blank');
    }

    const bussinesPhotos = (photos) => {
      let node = [];
      photos.forEach((item) => {
        node.push(<img style={{height: '200px', width: '200px'}} src={item} alt={'No Avatar'} />)
      });
      return node;
    }

    const timing = (times) => {
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

    const getTags = (categories) => {
      let node = [];
      categories.forEach(category => {
        node.push(<span className="tag-name">{category.title}</span>);
      });
      return node;
    }

    const specialHours = (special) => {
      let node = [];
      special.forEach((item) => {
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
      <>
        <div className="row">
          <div className="leftcolumn">
            <div className="container-header">
              <div >
                <img style={{height: '300px', width: '250px'}} src={image_url} alt="No Avatar" />
              </div>
              <div className="container">
                <div className="title-container" >
                  <h2 onClick={() => openNewTab(url)} style={{cursor: 'pointer'}}>{name}</h2><span className={is_closed ? 'red-dot' : 'green-dot'} ></span>
                </div>
                {getTags(categories)}
                <div>
                  <h3>{`${is_claimed ? 'Claimed': 'Not Claimed'}`}</h3>
                </div>
                <h3>Rating: {rating}/5</h3>
                <h3>Price: {price}</h3>
                <h3 >Phone: <a className="text" href={`tel:${phone}`}>{display_phone}</a></h3>
            </div>
          </div>
          <div className="timing-container">
            <h2>{photos.length ? 'Photos': ''}</h2>
            <div className="bussines-photos">
              {bussinesPhotos(photos)}
            </div>
            <div class="hours-container">
                <h2>Timing</h2>
                    <div className="heading-table">
                      <span>Day</span>
                      <span>Start</span>
                      <span>End</span>
                      <span>Over-night</span>
                    </div>
                    {timing(hours)}
                  </div>
              <div class="hours-container">
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
          </div>
          <div className="rightcolumn">
            <div className="container">
              <h2>About Me</h2>
              <div className="img" style={{height: '100px'}}>Image</div>
              <p>Some text about me in culpa qui officia deserunt mollit anim..</p>
            </div>
            <div className="container">
              <h3>Popular Post</h3>
              <div className="img">Image</div><br />
              <div className="img">Image</div><br />
              <div className="img">Image</div>
            </div>
            <div className="container">
              <h3>Follow Me</h3>
              <p>Some text..</p>
            </div>
          </div>
        </div>
      </>
    );
}

export default Content;

Content.DAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

