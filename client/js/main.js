import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createStore from 'shared/create-store';
import { addTodo, completeTodo } from 'shared/actions';
import routes from 'shared/routes';
import { createHistory } from 'history';
import { Router } from 'react-router';
import { syncReduxAndRouter } from 'redux-simple-router';

const initialState = JSON.parse(document.getElementById('__STATE__').innerText);
const store = createStore(initialState);
const history = createHistory();

syncReduxAndRouter(history, store);

store.subscribe(() => console.log("Store was updated!", store.getState()));

store.dispatch(addTodo("This is a new todo"));
store.dispatch(addTodo("This is another new todo"));
store.dispatch(addTodo("Do something"));
store.dispatch(addTodo("Do something else"));

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            {routes}
        </Router>
    </Provider>,
    document.getElementById('app')
);