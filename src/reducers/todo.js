import * as TodoActionTypes from '../actiontypes/todo';

function todos(
  state = {
    isFetching: false,
    didInvalidate: false,
    todos: []
  },
  action
) {
  switch (action.type) {
    case TodoActionTypes.REQUEST_TODOS:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      };
    case TodoActionTypes.RECIEVE_TODOS:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        todos: action.response
      };
    case TodoActionTypes.ADD_TODO:
      // TODO: fix backend usage so it is not an array
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            ...action.todo,
            id: action.tempId
          }
        ]
      };
    case TodoActionTypes.ADD_TODO_SUCCESS:
      const tempTodoIndex = state.todos.findIndex(todo => todo.id === action.tempId);
      const tempTodo = state.todos[tempTodoIndex];
      if (tempTodoIndex < 0) {
        throw new Error('Todo not found!');
      }
      // TODO: same as ADD_TODO - fix backend usage so it is not an array
      return {
        ...state,
        todos: [
          ...state.todos.slice(0, tempTodoIndex),
          {
            ...tempTodo,
            id: action.response[0]._id
          },
          ...state.todos.slice(tempTodoIndex + 1)
        ]
      };
    case TodoActionTypes.ADD_TODO_FAILURE:
      const tempTodoRemoveIndex = state.todos.findIndex(todo => todo.id === action.tempId); // TODO: extract
      return {
        ...state,
        todos: [
          ...state.todos.slice(0, tempTodoRemoveIndex),
          ...state.todos.slice(tempTodoRemoveIndex + 1)
        ]
      };
    case TodoActionTypes.REMOVE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.id)
      };
    case TodoActionTypes.REMOVE_TODO_FAILURE:
      const { todo: oldTodo, position: oldTodoPosition } = action.revert;
      return {
        ...state,
        todos: [
          ...state.todos.slice(0, oldTodoPosition),
          oldTodo,
          ...state.todos.slice(oldTodoPosition)
        ]
      };
    case TodoActionTypes.UPDATE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo => todo.id === action.id ? action.todo : todo)
      };
    case TodoActionTypes.UPDATE_TODO_FAILURE:
      return {
        ...state,
        todos: state.todos.map(todo => todo.id === action.id ? action.revert.todo : todo)
      };
    default:
      return state;
  }
}

export default todos;