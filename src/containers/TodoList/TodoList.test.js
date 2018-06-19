import { mapStateToProps, TodoList } from "./TodoList";
import { SetupComponent } from "react-component-setup";
import Todo from "../../components/Todo/Todo";
import DescriptionForm from "../../components/Todo/DescriptionForm";

const { shallow: setup } = SetupComponent({
  Component: TodoList,
  defaultProps: {
    addTodo: () => {},
    updateTodoDescription: () => {},
    checkTodo: () => {},
    removeTodo: () => {},
    todos: [
      {
        id: '10',
        description: 'math quiz',
        completed: false
      },
      {
        id: '11',
        description: 'computer science test',
        completed: true
      }
    ]
  }
});

describe('TodoList', () => {
  let wrapper;

  describe('given `todos`', () => {
    beforeEach(() => {
      ({ wrapper } = setup());
    });

    it('renders a list', () => {
      expect(wrapper.is('ul')).toBe(true);
    });

    it('renders a list of Todos', () => {
      expect(wrapper.find('ul').find(Todo)).toMatchSnapshot();
    });
  });

  it('renders a DescriptionForm in the list', () => {
    ({ wrapper } = setup());

    expect(wrapper.find('ul').find(DescriptionForm)).toMatchSnapshot();
  });

  describe('on DescriptionForm update', () => {
    let mockAddTodo;

    beforeEach(() => {
      mockAddTodo = jest.fn();

      ({ wrapper } = setup({
        addTodo: mockAddTodo
      }));

      wrapper.find(DescriptionForm).props().onUpdate('new description');
    });

    it('creates a new Todo', () => {
      expect(mockAddTodo).toHaveBeenCalledWith('new description');
    });
  });

  describe('Todo', () => {
    let mockCheckTodo, mockRemoveTodo, mockUpdateTodoDescription;
    beforeEach(() => {
      mockCheckTodo = jest.fn();
      mockRemoveTodo = jest.fn();
      mockUpdateTodoDescription = jest.fn();

      ({ wrapper } = setup({
        checkTodo: mockCheckTodo,
        removeTodo: mockRemoveTodo,
        updateTodoDescription: mockUpdateTodoDescription
      }));
    });
    describe('on check', () => {
      it('updates the todo\'s completed value', () => {
        wrapper.find(Todo).first().props().onCheck('10', true);
        expect(mockCheckTodo).toHaveBeenCalledWith('10', true);
      });
    });

    describe('on remove', () => {
      it('removes the todo', () => {
        wrapper.find(Todo).first().props().onRemove('10');
        expect(mockRemoveTodo).toHaveBeenCalledWith('10');
      });
    });

    describe('on update', () => {
      it('updates the todo\'s description', () => {
        wrapper.find(Todo).first().props().onUpdate('10', 'new description');
        expect(mockUpdateTodoDescription).toHaveBeenCalledWith('10', 'new description');
      });
    });
  });
});

describe('mapStateToProps', () => {
  it('returns todos', () => {
    const mockTodos = [
      {
        id: '1',
        description: 'hello',
        completed: false
      },
      {
        id: '2',
        description: 'world',
        completed: true
      }
    ];
    const mapped = mapStateToProps({
      todos: mockTodos,
      otherItems: 'hello'
    });

    expect(mapped).toEqual({
      todos: mockTodos
    });
  });
});
