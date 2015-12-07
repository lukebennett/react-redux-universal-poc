import createStore from '../../shared/create-store';
import { addTodo, completeTodo } from '../../shared/actions'

const initialState = JSON.parse(window.__STATE__.innerText);

const store = createStore(initialState);
store.subscribe(() => console.log("A new todo item was added!", store.getState()));
store.dispatch(addTodo("This is a new todo"));
store.dispatch(addTodo("This is another new todo"));