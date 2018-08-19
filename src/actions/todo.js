import * as TodoActionTypes from '../actiontypes/todo';
import uuid from 'uuid/v4';
import { CALL_API } from "../middleware/api/api";

export const fetchTodos = () => ({
  [CALL_API]: {
    types: [
      TodoActionTypes.REQUEST_TODOS,
      TodoActionTypes.RECIEVE_TODOS,
      TodoActionTypes.REQUEST_FAILURE_TODOS
    ],
    method: 'GET',
    endpoint: '/todo',
    minimumDelay: 1000
  }
});

export const addTodo = (description, completed) => {
  const todo = { description, completed };
  return {
    tempId: uuid(),
    todo,
    [CALL_API]: {
      types: [
        TodoActionTypes.ADD_TODO,
        TodoActionTypes.ADD_TODO_SUCCESS,
        TodoActionTypes.ADD_TODO_FAILURE
      ],
      method: 'POST',
      endpoint: '/todo',
      data: todo
    }
  }
};

export const updateTodo = (prevTodo, newTodo, id) => {

  const { id: unUsedId, ...newTodoWithoutId } = newTodo;

  return {
    id,
    todo: newTodo,
    revert: {
      todo: prevTodo
    },
    [CALL_API]: {
      types: [
        TodoActionTypes.UPDATE_TODO,
        TodoActionTypes.UPDATE_TODO_SUCCESS,
        TodoActionTypes.UPDATE_TODO_FAILURE
      ],
      method: 'PUT',
      endpoint: `/todo/${id}`,
      data: newTodoWithoutId
    }
  }
};

export const removeTodo = (todo, position, id) => ({
  id,
  revert: {
    todo,
    position
  },
  [CALL_API]: {
    types: [
      TodoActionTypes.REMOVE_TODO,
      TodoActionTypes.REMOVE_TODO_SUCCESS,
      TodoActionTypes.REMOVE_TODO_FAILURE
    ],
    method: 'DELETE',
    endpoint: `/todo/${id}`
  }
});
