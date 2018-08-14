import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import * as TodoActionCreators from '../../actions/todo';
import { fetchTodos } from '../../actions/todo';

import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import Todo from "../../components/Todo/Todo";
import NewTodo from "../../components/Todo/NewTodo";

import styles from './TodoList.module.css';

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

  constructor(props) {
    super(props);
    props.loadTodos();
  }

  updateTodoByProp = propName => todo => value =>
    this.props.updateTodo(todo, {
      ...todo,
      [propName]: value
    }, todo.id);

  addTodo = description => this.props.addTodo(description, false);
  checkTodo = this.updateTodoByProp('completed');
  updateDescription = this.updateTodoByProp('description');
  removeTodo = (todo, index) => () => this.props.removeTodo(todo, index, todo.id);

  render() {
    if (this.props.isLoading) {
      return ( // TODO: make spinner last longer (~300ms) even if todos load in immediately
        <div className={styles.loader}>
          <CircularProgress />
        </div>
      )
    }

    const { todos } = this.props;

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
      <List>
        {todoItems}
        <NewTodo onCreate={this.addTodo}/>
      </List>
    );
  }
}

export const mapStateToProps = state => ({
  todos: state.todos.todos,
  isLoading: state.todos.isFetching
});

const staticActions = {
  addTodo: TodoActionCreators.addTodo,
  updateTodo: TodoActionCreators.updateTodo,
  removeTodo: TodoActionCreators.removeTodo,
  loadTodos: fetchTodos
};

export default connect(mapStateToProps, staticActions)(TodoList);