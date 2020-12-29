import {dataAction} from '../actionTypes';

export const addData = item => ({
  type: dataAction.ADD_DATA,
  payload: item
});

export const appendData = item => ({
  type: dataAction.APPEND_DATA,
  payload: item
});

export const removeData = () => ({
  type: dataAction.REMOVE_DATA,
});
