import { createStore } from 'redux';
import app from './reducers';

export default state => createStore(app, state);