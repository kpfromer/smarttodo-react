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
    updateTodoDescription: PropTypes.func.isRequired,
    checkTodo: PropTypes.func.isRequired,
    removeTodo: PropTypes.func.isRequired
  };

  render() {
    const { todos, addTodo, checkTodo, removeTodo, updateTodoDescription } = this.props;

    const todoItems = todos.map(todo =>
      <Todo
        key={todo.id}
        id={todo.id}
        description={todo.description}
        completed={todo.completed}
        onCheck={checkTodo}
        onRemove={removeTodo}
        onUpdate={updateTodoDescription}
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

export const mapStateToProps = state => ( {
  todos: state.todos
} );

const actions = [
  'addTodo',
  'updateTodoDescription',
  'checkTodo',
  'removeTodo'
];

const mapDispatchToProps = actions.reduce(
  (actionList, actionName) => ( { ...actionList, [actionName]: TodoActionCreators[actionName] } ),
  {}
);

export default connect(mapStateToProps, mapDispatchToProps)(TodoList);