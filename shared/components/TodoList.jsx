import React from 'react';
import reactStamp from 'react-stamp';
import Todo from './Todo';

export default reactStamp(React).compose({
  render() {
    return (
      <ul>
        {this.props.todos.map((todo, index) =>
          <Todo {...todo}
                key={index}
                onClick={() => this.props.onTodoClick(index)}
                onSelect={() => this.props.onTodoSelect(index)}/>
        )}
      </ul>
    )
  }
})