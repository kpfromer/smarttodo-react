import TodoReducer from './todo';
import * as TodoActionTypes from "../actiontypes/todo";

// TODO: refactor test to follow nature flow
// TODO: Example for above request -> error, request -> success
describe('todo reducer', () => {
  let currentState;

  beforeEach(() => {
    currentState = {
      isFetching: false,
      didInvalidate: false,
      todos: [
        {
          id: '1',
          description: 'other',
          completed: true
        },
        {
          id: '2',
          description: 'todos',
          completed: false
        }
      ]
    };
  });

  it('should display spinner on todos request', () => {
    expect(TodoReducer(
      currentState,
      {
        type: TodoActionTypes.REQUEST_TODOS
      }
    )).toMatchSnapshot();
  });

  it('should replace todos from api response', () => {
    const completelyOtherTodos = [
      {
        id: '13242352',
        description: 'math science, chem',
        completed: false
      },
      {
        id: '2dfasdfasdf',
        description: 'different',
        completed: true
      },
      {
        id: '12345',
        description: 'ss test',
        completed: false
      }
    ];
    expect(TodoReducer(
      currentState,
      {
        type: TodoActionTypes.RECIEVE_TODOS,
        response: completelyOtherTodos
      }
    )).toMatchSnapshot();
  });

  describe('ADD_TODO', () => {
    let tempId;

    beforeEach(() => {
      tempId = 'a-temp-id';
      currentState = {
        ...currentState,
        todos: [
          {
            id: '13242352',
            description: 'math science, chem',
            completed: false
          },
          {
            id: '2dfasdfasdf',
            description: 'different',
            completed: true
          },
          {
            id: tempId,
            description: 'old todo',
            completed: false
          }
        ]
      };
    });

    it('should add a todo', () => {
      const newState = TodoReducer(
        currentState,
        {
          type: TodoActionTypes.ADD_TODO,
          todo: {
            description: 'New Task',
            completed: true
          },
          tempId: 'a-temp-id-if-needed-to-remove-todo'
        }
      );

      expect(newState).toMatchSnapshot();
    });

    it('should remove todo if the add todo api call fails', () => {
      expect(TodoReducer(
        currentState,
        {
          type: TodoActionTypes.ADD_TODO_FAILURE,
          tempId
        }
      )).toMatchSnapshot();
    });
    it('should replace the added todo with the real id from api response', () => {
      expect(TodoReducer(
        currentState,
        {
          type: TodoActionTypes.ADD_TODO_SUCCESS,
          tempId,
          response: [
            {
              _id: 'api-database-id!'
            }
          ]
        }
      )).toMatchSnapshot();
    });
  });

  describe('REMOVE_TODO', () => {
    it('should remove a todo', () => {
      const newState = TodoReducer(
        currentState,
        {
          type: TodoActionTypes.REMOVE_TODO,
          id: '1'
        }
      );

      expect(newState).toMatchSnapshot();
    });
    it('should revert to original todo if remove todo api call fails', () => {
      const todo = {
        id: '1',
        description: 'reverted todo',
        completed: true
      };
      const newState = TodoReducer(
        currentState,
        {
          type: TodoActionTypes.REMOVE_TODO_FAILURE,
          id: '1',
          revert: {
            todo,
            position: 0
          }
        }
      );

      expect(newState).toMatchSnapshot();
    });
  });

  describe('UPDATE_TODO', () => {
    it('should update a todo', () => {
      const todo = {
        id: '1',
        description: 'updated description',
        completed: false
      };
      const newState = TodoReducer(
        currentState,
        {
          type: TodoActionTypes.UPDATE_TODO,
          id: todo.id,
          todo
        }
      );

      expect(newState).toMatchSnapshot();
    });
    it('should revert to original todo if update todo api call fails', () => {
      const todo = {
        id: '1',
        description: 'reverted',
        completed: true
      };
      const newState = TodoReducer(
        currentState,
        {
          type: TodoActionTypes.UPDATE_TODO_FAILURE,
          id: todo.id,
          revert: {
            todo
          }
        }
      );

      expect(newState).toMatchSnapshot();
    });
  });
});