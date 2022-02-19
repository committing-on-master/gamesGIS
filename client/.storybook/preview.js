import "./../src/App.scss";
import { BrowserRouter } from "react-router-dom";
import { store } from "./../src/store/store";
import { Provider } from "react-redux";

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