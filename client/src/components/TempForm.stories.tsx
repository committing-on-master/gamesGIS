import { ComponentStory, ComponentMeta } from '@storybook/react';

import TempForm from "./TempForm";
import { Provider } from 'react-redux';
import { store } from '../store/store';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'components/TempForm',
  component: TempForm,
} as ComponentMeta<typeof TempForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TempForm> = () => <TempForm/>;

export const Primary = Template.bind({});
Primary.decorators = [(Story) => 
    <Provider store={store}>
        <Story/>
    </Provider>
]