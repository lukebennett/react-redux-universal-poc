import React from 'react';
import reactStamp from 'react-stamp';
import { connect } from 'react-redux';
import { addTodo, completeTodo } from '../actions'
import AddTodo from '../components/AddTodo';
import TodoList from '../components/TodoList';

const App = reactStamp(React).compose({
  render() {
    const { dispatch, todos } = this.props;
    return (
      <div>
        <AddTodo
          onAddClick={text => dispatch(addTodo(text))} />
        <TodoList
          todos={todos}
          onTodoClick={index => dispatch(completeTodo(index))} />
      </div>
    )
  }
});

export default connect((state) => state)(App);