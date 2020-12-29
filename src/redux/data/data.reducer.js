import {dataAction} from '../actionTypes';

const INITIAL_STATE = {
  businesses: [],
  markers: [],
  region: {}
}


const appendMarkers = (items=[]) => {
  let nodes = [];
  items.length && items.forEach((data) => {
      data["coordinates"] && nodes.push(data["coordinates"])
  });
  return nodes;
}

const dataReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case dataAction.ADD_DATA:
      return {
        businesses: [...action.payload.businesses],
        markers: appendMarkers(action.payload.businesses),
        region: action.payload.region.center

      }
    case dataAction.APPEND_DATA:
      return {
        businesses: [...state.businesses, ...action.payload.businesses],
        markers: [...state.markers, ...appendMarkers(action.payload.businesses)],
        region: action.payload.region.center
      };
    case dataAction.REMOVE_DATA:
      return INITIAL_STATE;
    default:
      return state;
  }
};

export default dataReducer;
