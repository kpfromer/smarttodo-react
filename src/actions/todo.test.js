import * as TodoActionCreators from './todo';
import * as TodoActionTypes from '../actiontypes/todo';

describe('todo actions', () => {
  it('creates an action to add a todo', () => {
    const description = 'hello world';
    const completed = true;
    const expected = {
      type: TodoActionTypes.ADD_TODO,
      description,
      completed
    };

    expect(TodoActionCreators.addTodo(description, completed)).toEqual(expected);
  });
  it('creates an action to remove a todo', () => {
    const id = '101';
    const expected = {
      type: TodoActionTypes.REMOVE_TODO,
      id
    };

    expect(TodoActionCreators.removeTodo(id)).toEqual(expected);
  });
  it('creates an action to update a todo\'s description', () => {
    const id = '666';
    const description = 'hello, world';
    const expected = {
      type: TodoActionTypes.UPDATE_TODO_DESCRIPTION,
      id,
      description
    };

    expect(TodoActionCreators.updateTodoDescription(id, description)).toEqual(expected);
  });
  it('creates an action to add a todo\'s completed value', () => {
    const id = '941223';
    const completed = true;
    const expected = {
      type: TodoActionTypes.UPDATE_TODO_COMPLETED,
      id,
      completed
    };

    expect(TodoActionCreators.updateTodoCompleted(id, completed)).toEqual(expected);
  });
});