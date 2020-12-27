import {React, useState} from 'react';
import './App.css';
import { Catalog } from './container';
import {Content } from './components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const token = 'PM7x7jHg1hOjzKA0xps_LDQjWC8CqJMa2Crnv5kuHmGMcgus__z_XLGNoGR9_hjBOwJjWIs6mDuXlslMpHuBbdLjHyY-ywqHQ8CMYOkfDkrgQ2ZFJlk6rzwgwZWYX3Yx';
const uri = `${'https://cors-anywhere.herokuapp.com/'}https://api.yelp.com/v3/businesses/search?`;
const REACT_MAP_MAPBOX_TOKEN = "pk.eyJ1IjoicmlzaGF2LW1laHRhIiwiYSI6ImNrajRvenR0ejN3c2wycXNjd3gydmpkZ3kifQ.RbUABwS1Z17kN9vdq9U4hQ";
function App() {
  const [data, setRenderData] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [region, setRegion] = useState({});
  const [queries, setQueries] = useState({
    text: '',
    limit: 20,
    totalPage: 1,
    page: 1
  });
  const [isLoadingMore, setLoadingMore] = useState(false);


  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={() =>
            (<Catalog url={uri} token={token} mapToken={REACT_MAP_MAPBOX_TOKEN}
            data={data} setRenderData={setRenderData}
            markers={markers} setMarkers={setMarkers}
            region={region} setRegion={setRegion}
            queries={queries} setQueries={setQueries}
            isLoadingMore={isLoadingMore} setLoadingMore={setLoadingMore}/>)} />
          <Route path="/bussines/:busid" exact component={
            () => (<Content token={token} mapToken={REACT_MAP_MAPBOX_TOKEN}/>)} />
        </Switch>
      </div>
    </Router>
  );
}

//  <Route component={PageNotFound} />

export default App;
