import { ComponentStory, ComponentMeta } from '@storybook/react';

import { HomePage } from "./HomePage";

export default {
  title: 'Home/HomePage',
  component: HomePage,
} as ComponentMeta<typeof HomePage>;

const Template: ComponentStory<typeof HomePage> = () => <HomePage/>;

export const Primary = Template.bind({});
