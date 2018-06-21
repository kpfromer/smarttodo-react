import TodoReducer from './todo';
import * as TodoActionTypes from "../actiontypes/todo";

describe('todo reducer', () => {
  let currentState;

  beforeEach(() => {
    currentState = {
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

  it('should add a todo', () => {
    const newState = TodoReducer(
      currentState,
      {
        type: TodoActionTypes.ADD_TODO,
        description: 'New Task',
        completed: true
      }
    );

    expect(newState).toMatchSnapshot();
  });
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
  it('should update a todo\'s description', () => {
    const newState = TodoReducer(
      currentState,
      {
        type: TodoActionTypes.UPDATE_TODO_DESCRIPTION,
        id: '1',
        description: 'i am NEW!'
      }
    );

    expect(newState).toMatchSnapshot();
  });
  it('should update a todo\'s completed', () => {
    const newState = TodoReducer(
      currentState,
      {
        type: TodoActionTypes.UPDATE_TODO_COMPLETED,
        id: '1',
        completed: false
      }
    );

    expect(newState).toMatchSnapshot();
  });
});