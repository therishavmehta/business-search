import {searchAction} from '../actionTypes';

export const addSearch = item => ({
  type: searchAction.ADD_QUERY,
  payload: item
});

export const appendSearch = item => ({
  type: searchAction.APPEND_QUERY,
  payload: item
});

export const removeSearch = () => ({
  type: searchAction.REMOVE_QUERY,
});
