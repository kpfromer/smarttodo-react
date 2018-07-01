import { mapStateToProps, TodoList } from "./TodoList";
import { SetupComponent } from "react-component-setup";
import Todo from "../../components/Todo/Todo";
import DescriptionForm from "../../components/Todo/DescriptionForm";

const todos = [
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
];

const { shallow: setup } = SetupComponent({
  Component: TodoList,
  defaultProps: {
    addTodo: () => {},
    updateTodo: () => {},
    removeTodo: () => {},
    loadTodos: () => {},
    todos
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
    let mockUpdateTodo, mockRemoveTodo;
    beforeEach(() => {
      mockUpdateTodo = jest.fn();
      mockRemoveTodo = jest.fn();

      ({ wrapper } = setup({
        updateTodo: mockUpdateTodo,
        removeTodo: mockRemoveTodo
      }));
    });
    describe('on check', () => {
      it('updates the todo\'s completed value', () => {
        wrapper.find(Todo).first().props().onCheck(true);
        expect(mockUpdateTodo).toHaveBeenCalledWith(
          {
            id: '10',
            description: 'math quiz',
            completed: false
          },
          {
            id: '10',
            description: 'math quiz',
            completed: true
          },
          '10'
        );
      });
    });

    describe('on remove', () => {
      it('removes the todo', () => {
        const position = 1;
        wrapper.find(Todo).at(position).props().onRemove();
        expect(mockRemoveTodo).toHaveBeenCalledWith(todos[position], position, todos[position].id);
      });
    });

    describe('on update', () => {
      it('updates the todo\'s description', () => {
        const description = 'new description';
        wrapper.find(Todo).first().props().onUpdate(description);
        expect(mockUpdateTodo).toHaveBeenCalledWith(
          {
            id: '10',
            description: 'math quiz',
            completed: false
          },
          {
            id: '10',
            description: description,
            completed: false
          },
          '10'
        );
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
      todos: {
        todos: mockTodos
      }
    });

    expect(mapped).toEqual({
      todos: mockTodos
    });
  });
});



// TODO: test for fetch todos