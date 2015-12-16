import React from 'react';
import reactStamp from 'react-stamp';
import { connect } from 'react-redux';
import { addTodo, completeTodo, selectTodo } from '../actions'
import AddTodo from '../components/AddTodo';
import TodoList from '../components/TodoList';
import { updatePath } from 'redux-simple-router';

const App = reactStamp(React).compose({
  render() {
    const { addTodo, completeTodo, selectTodo, todos } = this.props;
    return (
      <div>
        <AddTodo
          onAddClick={text => addTodo(text)} />
        <TodoList
          todos={todos}
          onTodoClick={index => completeTodo(index)}
          onTodoSelect={index => selectTodo(index)}/>
      </div>
    )
  }
});

App.populateStore = (store, props) => {
    const id = decodeURI(props.params.todoIndex),
          todo = store.dispatch(selectTodo(id));
}

function mapStateToProps(state) {
  return {
    todos: state.todos
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectTodo: (index) => dispatch(selectTodo(index)),
    completeTodo: (index) => dispatch(completeTodo(index)),
    addTodo: (text) => dispatch(addTodo(text))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);