import * as TodoActionTypes from '../actiontypes/todo';

export const addTodo = (description, completed = false) => {
  return {
    type: TodoActionTypes.ADD_TODO,
    description,
    completed
  };
};

export const removeTodo = id => {
  return {
    type: TodoActionTypes.REMOVE_TODO,
    id
  };
};

export const updateTodoDescription = (id, description) => {
  return {
    type: TodoActionTypes.UPDATE_TODO_DESCRIPTION,
    id,
    description
  };
};

export const updateTodoCompleted = (id, completed) => {
  return {
    type: TodoActionTypes.UPDATE_TODO_COMPLETED,
    id,
    completed
  }
};