import './App.css';
import { Catalog } from './container';

const token = 'PM7x7jHg1hOjzKA0xps_LDQjWC8CqJMa2Crnv5kuHmGMcgus__z_XLGNoGR9_hjBOwJjWIs6mDuXlslMpHuBbdLjHyY-ywqHQ8CMYOkfDkrgQ2ZFJlk6rzwgwZWYX3Yx';
const uri = 'https://api.yelp.com/v3/businesses/search?';

function App() {
  return (
    <div className="App">
        <Catalog token={token} uri={uri}/>
    </div>
  );
}

export default App;
