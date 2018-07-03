import NotFound from "./NotFound";
import { SetupComponent } from "react-component-setup";

const { shallow: setup } = SetupComponent({
  component: NotFound
});

describe('NotFound', () => {
  it('renders without crashing', () => {
    setup();
  });

  it('renders a not found message', () => {
    const { wrapper } = setup();

    expect(wrapper).toMatchSnapshot();
  });
});