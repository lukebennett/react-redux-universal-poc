import React from 'react';
import reactStamp from 'react-stamp';
import { connect } from 'react-redux';
import { addTodo, completeTodo, selectTodo } from '../actions'
import AddTodo from '../components/AddTodo';
import TodoList from '../components/TodoList';
import { updatePath } from 'redux-simple-router';

const App = reactStamp(React).compose({
  render() {
    const { dispatch, todos } = this.props;
    return (
      <div>
        <AddTodo
          onAddClick={text => dispatch(addTodo(text))}
          dispatch={dispatch} />
        <TodoList
          todos={todos}
          onTodoClick={index => dispatch(completeTodo(index))}
          onTodoSelect={index => dispatch(selectTodo(index))}/>
      </div>
    )
  }
});

export default connect((state) => state)(App);