import { combineReducers } from 'redux';
import * as reducers from './reducers';
import { routeReducer } from 'redux-simple-router';

export default combineReducers({
    ...reducers,
    routing: routeReducer
})