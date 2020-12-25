import './App.css';
import { Catalog } from './container';
import {Content} from './components';
import {sampleBussines} from './data';

const token = 'PM7x7jHg1hOjzKA0xps_LDQjWC8CqJMa2Crnv5kuHmGMcgus__z_XLGNoGR9_hjBOwJjWIs6mDuXlslMpHuBbdLjHyY-ywqHQ8CMYOkfDkrgQ2ZFJlk6rzwgwZWYX3Yx';
const uri = 'https://api.yelp.com/v3/businesses/search?';

function App() {
  return (
    <div className="App">
      <Content {...sampleBussines}/>
    </div>
  );
}

export default App;
