import { mapStateToProps, TodoList } from "./TodoList";
import { SetupComponent } from "react-component-setup";
import List from '@material-ui/core/List';
import CircularProgress from '@material-ui/core/CircularProgress';
import Todo from "../../components/Todo/Todo";
import NewTodo from "../../components/Todo/NewTodo";

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
  component: TodoList,
  defaultProps: {
    addTodo: () => {},
    updateTodo: () => {},
    removeTodo: () => {},
    loadTodos: () => {},
    todos,
    isLoading: false
  }
});

describe('TodoList', () => {
  let wrapper;

  it('loads todos on creation', () => {
    const mockLoadTodos = jest.fn();
    setup({
      loadTodos: mockLoadTodos
    });

    expect(mockLoadTodos).toHaveBeenCalled();
  });

  it('renders a spinner while fetching todos', () => {
    ({ wrapper } = setup({
      isLoading: true
    }));
    expect(wrapper.find(CircularProgress)).toExist();
    expect(wrapper.find(List)).not.toExist();
  });

  describe('given `todos`', () => {
    beforeEach(() => {
      ({ wrapper } = setup());
    });

    it('renders a list', () => {
      expect(wrapper.is(List)).toBe(true);
    });

    it('renders a list of Todos', () => {
      expect(wrapper.find(List).find(Todo)).toMatchSnapshot();
    });
  });

  it('renders a NewTodo in the list', () => {
    ({ wrapper } = setup());

    expect(wrapper.find(NewTodo)).toExist();
  });

  describe('on NewTodo create', () => {
    let mockAddTodo;

    beforeEach(() => {
      mockAddTodo = jest.fn();

      ({ wrapper } = setup({
        addTodo: mockAddTodo
      }));

      wrapper.find(NewTodo).props().onCreate('new description');
      wrapper.update();
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
  let valid;

  beforeEach(() => {
    valid = {
      todos: [],
      isFetching: false
    }
  });

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
        ...valid,
        todos: mockTodos
      }
    });

    expect(mapped).toMatchObject({
      todos: mockTodos
    });
  });
  it('returns isLoading', () => {
    const isFetching = true;
    const mapped = mapStateToProps({
      todos: {
        ...valid,
        isFetching
      }
    });
    expect(mapped).toMatchObject({
      isLoading: isFetching
    })
  });
});
