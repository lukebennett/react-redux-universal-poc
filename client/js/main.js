import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createStore from 'shared/create-store';
import { addTodo, completeTodo } from 'shared/actions';
import App from 'shared/containers/App';

const initialState = JSON.parse(document.getElementById('__STATE__').innerText);
const store = createStore(initialState);

store.subscribe(() => console.log("Store was updated!", store.getState()));

store.dispatch(addTodo("This is a new todo"));
store.dispatch(addTodo("This is another new todo"));
store.dispatch(addTodo("Do something"));
store.dispatch(addTodo("Do something else"));

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('app'));