import * as TodoActionCreators from './todo';
import { CALL_API } from "../middleware/api/api";
import uuid from 'uuid/v4';

jest.mock('uuid/v4', () => jest.fn());

describe('todo actions', () => {
  let action;

  afterEach(() => {
    uuid.mockClear();
  });

  describe('fetchTodos', () => {
    beforeEach(() => {
      action = TodoActionCreators.fetchTodos();
    });

    it('creates an action to GET todos', () => {
      expect(action[CALL_API]).toMatchSnapshot();
    });
    it('maps todos\' _id from api response to id', () => {
      const todosFromApi = [
        {
          _id: 'a mongo id',
          description: 'hello'
        },
        {
          _id: 'gibberish',
          description: 'world'
        }
      ];
      expect(action[CALL_API].mapResponse(todosFromApi)).toMatchSnapshot();
    });
  });

  describe('addTodo', () => {
    let description, completed, mockUuid;

    beforeEach(() => {
      description = 'hello world';
      completed = true;
      mockUuid = 'mock uuid';

      uuid.mockReturnValue(mockUuid);

      action = TodoActionCreators.addTodo(description, completed);
    });

    it('sends a tempId for the new todo', () => {
      expect(action.tempId).toBe(mockUuid);
      expect(uuid).toHaveBeenCalled();
    });
    it('sends the todo', () => {
      expect(action.todo).toMatchSnapshot();
    });

    it('creates an api action to POST a todo', () => {
      expect(action[CALL_API]).toMatchSnapshot();
    });
  });

  describe('updateTodo', () => {
    let id, prevTodo, newTodo;
    beforeEach(() => {
      id = '1';
      prevTodo = {
        id,
        description: 'old description',
        completed: false
      };
      newTodo = {
        id,
        description: 'NEW! description',
        completed: true
      };
      action = TodoActionCreators.updateTodo(prevTodo, newTodo, id);
    });

    it('updates old todo by id using new todo', () => {
      expect(action.id).toBe(id);
      expect(action.todo).toMatchSnapshot();
    });
    it('can revert back to old todo', () => {
      expect(action.revert).toMatchSnapshot();
    });
    it('creates an action to PUT a new todo', () => {
      expect(action[CALL_API]).toMatchSnapshot();
    });
  });

  describe('removeTodo', () => {
    let todo, position, id;
    beforeEach(() => {
      todo = {
        description: 'to be removed!',
        completed: true
      };
      position = 20;
      id = '4124id';
      action = TodoActionCreators.removeTodo(todo, position, id);
    });

    it('removes todo by id', () => {
      expect(action.id).toBe(id);
    });
    it('can revert back to old todo at the same position', () => {
      expect(action.revert).toMatchSnapshot();
    });
    it('creates an action to DELETE a todo', () => {
      expect(action[CALL_API]).toMatchSnapshot();
    });
  });
});