import { ComponentStory, ComponentMeta } from '@storybook/react';

import { MapProfileCreationForm } from "./MapProfileCreationForm";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'profile/MapProfileCreationForm',
  component: MapProfileCreationForm,
} as ComponentMeta<typeof MapProfileCreationForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof MapProfileCreationForm> = () => <MapProfileCreationForm/>;

export const Primary = Template.bind({});