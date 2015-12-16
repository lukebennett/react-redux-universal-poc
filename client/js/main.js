import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createStore from 'shared/create-store';
import { addTodo, completeTodo } from 'shared/actions';
import getRoutes from 'shared/routes';
import { createHistory } from 'history';
import { syncReduxAndRouter } from 'redux-simple-router';

const initialState = JSON.parse(document.getElementById('__STATE__').innerText);
const store = createStore(initialState);
const history = createHistory({ forceRefresh: false });

syncReduxAndRouter(history, store);

store.subscribe(() => console.log("Store was updated!", store.getState()));

ReactDOM.render(
    React.createElement(Provider, { store }, getRoutes(store, history)),
    document.getElementById('app')
);