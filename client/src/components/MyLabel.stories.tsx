import { ComponentStory, ComponentMeta } from '@storybook/react';

import { MyLabel } from "./MyLabel";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'components/MyLabel',
  component: MyLabel,
} as ComponentMeta<typeof MyLabel>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MyLabel> = () => <MyLabel/>;

export const Primary = Template.bind({});