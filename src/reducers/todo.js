import * as TodoActionTypes from '../actiontypes/todo';
import { combineReducers } from "redux";

const TODOS = [
  {
    id: '10000',
    description: 'hello',
    completed: true
  },
  {
    id: '10001',
    description: 'jack',
    completed: false
  },
  {
    id: '10002',
    description: 'science hw',
    completed: true
  },
  {
    id: '10003',
    description: 'math test',
    completed: true
  }
];

let apiId = 0;

const findItemIndexById = (id, list) => list.findIndex(item => item.id === id);

// TODO: add axios and post/get

function todos(state = TODOS, action) {
  switch (action.type) {
    case TodoActionTypes.ADD_TODO:
      const addPlayerList = [
        ...state,
        {
          id: apiId.toString(),
          description: action.description,
          completed: action.completed
        }
      ];
      apiId += 1;
      return addPlayerList;

    case TodoActionTypes.REMOVE_TODO:
      const todoIndex = findItemIndexById(action.id, state);
      const removePlayerList = [
        ...state.slice(0, todoIndex),
        ...state.slice(todoIndex + 1)
      ];
      return removePlayerList;

    case TodoActionTypes.UPDATE_TODO_DESCRIPTION:
      const updatePlayerDescriptionList = state.map((todo, index) => {
        if (index === findItemIndexById(action.id, state)) {
          return {
            ...todo,
            description: action.description
          }
        }
        return todo;
      });
      return updatePlayerDescriptionList;

    case TodoActionTypes.UPDATE_TODO_COMPLETED:
      const updatePlayerCompletedList = state.map((todo, index) => {
        if (index === findItemIndexById(action.id, state)) {
          return {
            ...todo,
            completed: action.completed,
          }
        }
        return todo;
      });
      return updatePlayerCompletedList;

    default:
      return state;
  }
}

const todoApp = combineReducers({
  todos
});

export default todoApp;