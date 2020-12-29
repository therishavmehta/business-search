import {searchAction} from '../actionTypes';

const INITIAL_STATE = {
  bussines: '',
  address: '',
  longitude: '',
  latitude: '',
  isLoading: false,
  snackbar: '',
  param: '',
  pagination: {
    page: 1,
    totalPage: 1,
    limit: 20
  }
}

const searchReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case searchAction.ADD_QUERY:
      return {...action.payload};
    case searchAction.APPEND_QUERY:
      return {...state, ...action.payload};
    case searchAction.REMOVE_QUERY:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default searchReducer;
