import * as TodoActionTypes from '../actiontypes/todo';

const initialState = {
  todos: [
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
  ]
};

let apiId = 0;

const findItemIndexById = (id, list) => list.findIndex(item => item.id === id);

// TODO: add axios and post/get
// Should be a pure function (does not mutate the state)
export default function Todo(state = initialState, action) {
  // We use action.type seen in the type in actions/player.js and name aswell
  switch (action.type) {
    case TodoActionTypes.ADD_TODO:
      const addPlayerList = [
        ...state.todos,
        {
          id: apiId.toString(),
          description: action.description,
          completed: action.completed
        }
      ];
      apiId += 1;
      return {
        ...state,
        todos: addPlayerList
      };

    case TodoActionTypes.REMOVE_TODO:
      const todoIndex = findItemIndexById(action.id, state.todos);
      const removePlayerList = [
        ...state.todos.slice(0, todoIndex),
        ...state.todos.slice(todoIndex + 1)
      ];
      return {
        ...state,
        todos: removePlayerList
      };

    case TodoActionTypes.UPDATE_TODO_DESCRIPTION:
      const updatePlayerDescriptionList = state.todos.map((todo, index) => {
        if (index === findItemIndexById(action.id, state.todos)) {
          return {
            ...todo,
            description: action.description
          }
        }
        return todo;
      });
      return {
        ...state,
        todos: updatePlayerDescriptionList
      };

    case TodoActionTypes.UPDATE_TODO_COMPLETED:
      const updatePlayerCompletedList = state.todos.map((todo, index) => {
        if (index === findItemIndexById(action.id, state.todos)) {
          return {
            ...todo,
            completed: action.completed,
          }
        }
        return todo;
      });
      return {
        ...state,
        todos: updatePlayerCompletedList
      };

    default:
      return state;
  }
}
