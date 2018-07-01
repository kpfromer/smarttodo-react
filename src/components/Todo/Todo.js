import React, { Component } from "react";
import PropTypes from 'prop-types';

import styles from './Todo.module.scss'

import DescriptionForm from "./DescriptionForm";

export default class Todo extends Component {

  static propTypes = {
    description: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    onCheck: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired
  };

  state = {
    editing: false
  };

  checkTodo = event => this.props.onCheck(event.target.checked);
  removeTodo = () => this.props.onRemove();

  startEditing = () =>
    this.setState({ editing: true });

  handleUpdate = description => {
    this.setState({ editing: false });
    this.props.onUpdate(description);
  };

  render() {
    const { description, completed } = this.props;

    const completedStyle = completed ? styles.completed : '';
    const editingStyle = this.state.editing ? styles.editing : '';

    return (
      <li className={`${styles.todo} ${completedStyle} ${editingStyle}`}>
        <div className={styles.view}>
          <input
            className={styles.toggle}
            type="checkbox"
            checked={completed}
            onChange={this.checkTodo}
          />
          <label onDoubleClick={this.startEditing}>{description}</label>
          <button className={styles.destroy} onClick={this.removeTodo}/>
        </div>
        <DescriptionForm
          className={styles.edit}
          invalidClassName={styles.invalid}
          description={description}
          onUpdate={this.handleUpdate}
        />
      </li>
    );
  }
}