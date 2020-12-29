import { combineReducers } from 'redux';

import searchReducer from './search/search.reducer';
import dataReducer from './data/data.reducer';
import filterReducer from './filter/filter.reducer';

const rootReducer = combineReducers({
  data: dataReducer,
  search: searchReducer,
  filters: filterReducer
});

export default rootReducer;