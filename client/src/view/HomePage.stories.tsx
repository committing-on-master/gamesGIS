import { ComponentStory, ComponentMeta } from '@storybook/react';

import { HomePage } from "./HomePage";

export default {
  title: 'Pages/Home',
  component: HomePage,
} as ComponentMeta<typeof HomePage>;

const Template: ComponentStory<typeof HomePage> = () => <HomePage/>;

export const Primary = Template.bind({});
