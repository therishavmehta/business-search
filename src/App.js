import {React} from 'react';
import './App.css';
import { Catalog } from './container';
import { Content } from './components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const token = 'PM7x7jHg1hOjzKA0xps_LDQjWC8CqJMa2Crnv5kuHmGMcgus__z_XLGNoGR9_hjBOwJjWIs6mDuXlslMpHuBbdLjHyY-ywqHQ8CMYOkfDkrgQ2ZFJlk6rzwgwZWYX3Yx';
const uri = `${'https://cors-anywhere.herokuapp.com/'}https://api.yelp.com/v3/businesses/search?`;
const REACT_MAP_MAPBOX_TOKEN = "pk.eyJ1IjoicmlzaGF2LW1laHRhIiwiYSI6ImNrajRvenR0ejN3c2wycXNjd3gydmpkZ3kifQ.RbUABwS1Z17kN9vdq9U4hQ";
function App() {

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={() =>
            (<Catalog url={uri} token={token} mapToken={REACT_MAP_MAPBOX_TOKEN} />)} />
          <Route path="/businesses/:busid" exact component={() => 
            (<Content url={uri} token={token} mapToken={REACT_MAP_MAPBOX_TOKEN}/>)} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
