import {filterAction} from '../actionTypes';

const INITIAL_STATE = {
  price: [],
  status: [],
}

const filterReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case filterAction.ADD_FITLER:
      return {...action.payload};
    case filterAction.APPEND_FITLER:
      return {...state, ...action.payload};
    case filterAction.REMOVE_FITLER:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default filterReducer;
