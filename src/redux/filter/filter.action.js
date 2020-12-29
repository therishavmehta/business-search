import {filterAction} from '../actionTypes';

export const addFilter = item => ({
  type: filterAction.ADD_FITLER,
  payload: item
});

export const appendFilter = item => ({
  type: filterAction.APPEND_FITLER,
  payload: item
});

export const removeFilter = () => ({
  type: filterAction.REMOVE_FITLER,
});
