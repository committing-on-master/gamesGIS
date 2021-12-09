import { ComponentStory, ComponentMeta } from '@storybook/react';

import { HowToPage } from "./HowToPage";

export default {
  title: 'Pages/HowTo',
  component: HowToPage,
} as ComponentMeta<typeof HowToPage>;

const Template: ComponentStory<typeof HowToPage> = () => <HowToPage/>;

export const Primary = Template.bind({});
