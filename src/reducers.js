import { combineReducers } from 'redux';
// 通用
import Common from 'reducer/index.js';
import Sort from 'pages/Sort/reducer.js';

export default combineReducers({
  Common,
  Sort
});
