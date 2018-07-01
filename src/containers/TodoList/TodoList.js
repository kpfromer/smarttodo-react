import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import * as TodoActionCreators from '../../actions/todo';

import styles from './TodoList.module.scss';

import Todo from "../../components/Todo/Todo";
import DescriptionForm from "../../components/Todo/DescriptionForm";

export class TodoList extends Component {

  static propTypes = {
    todos: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired
    })),
    addTodo: PropTypes.func.isRequired,
    updateTodo: PropTypes.func.isRequired,
    removeTodo: PropTypes.func.isRequired
  };

  updateTodoByProp = propName => todo => value =>
    this.props.updateTodo(todo, {
      ...todo,
      [propName]: value
    }, todo.id);

  checkTodo = this.updateTodoByProp('completed');
  updateDescription = this.updateTodoByProp('description');
  removeTodo = (todo, index) => () => this.props.removeTodo(todo, index, todo.id);

  render() {
    const { todos, addTodo } = this.props;

    const todoItems = todos.map((todo, index) =>
      <Todo
        key={todo.id}
        description={todo.description}
        completed={todo.completed}
        onCheck={this.checkTodo(todo)}
        onUpdate={this.updateDescription(todo)}
        onRemove={this.removeTodo(todo, index)}
      />
    );
    return (
      <ul className={styles.list}>
        {todoItems}
        <DescriptionForm
          clearOnUpdate
          className={styles.newTodo}
          invalidClassName={styles.invalid}
          onUpdate={addTodo}
        />
      </ul>
    );
  }
}

export const mapStateToProps = state => ({
  todos: state.todos.todos
});

const staticActions = {
  addTodo: TodoActionCreators.addTodo,
  updateTodo: TodoActionCreators.updateTodo,
  removeTodo: TodoActionCreators.removeTodo
};

export default connect(mapStateToProps, staticActions)(TodoList);