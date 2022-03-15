import "./../src/index";
import { BrowserRouter } from "react-router-dom";
import { store } from "./../src/store/store";
import { Provider } from "react-redux";
import { initialize, mswDecorator } from 'msw-storybook-addon';

initialize();

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      method: 'alphabetical'
    }
  }
};

export const decorators = [
  mswDecorator,
  (Story) => (
    <BrowserRouter>
      <Story />
    </BrowserRouter>
  ),
  (Story) =>
    <Provider store={store}>
      <Story />
    </Provider>
];