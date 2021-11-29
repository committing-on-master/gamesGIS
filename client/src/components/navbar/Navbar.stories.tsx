import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Navbar } from "./Navbar";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'components/Navbar',
  component: Navbar,
} as ComponentMeta<typeof Navbar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Navbar> = () => <Navbar/>;

export const Primary = Template.bind({});