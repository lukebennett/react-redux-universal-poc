import React from 'react';
import reactStamp from 'react-stamp';
import { Link } from 'react-router';

export default reactStamp(React).compose({
  render() {
    return (
      <li
        style={{
          textDecoration: this.props.completed ? 'line-through' : 'none',
          fontWeight: this.props.selected ? 'bold' : 'normal'
        }}>
        <input type="checkbox" onClick={this.props.onClick} checked={this.props.completed}/>&nbsp;
        {this.props.text} [<Link to={this.props.text.toLowerCase().replace(/\s/g, '-')} onClick={this.props.onSelect}>select</Link>]
      </li>
    )
  }
})
