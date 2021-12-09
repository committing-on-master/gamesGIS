import 'bulma/css/bulma.css'
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