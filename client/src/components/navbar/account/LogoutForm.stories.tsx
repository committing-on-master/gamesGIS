import { ComponentStory, ComponentMeta } from '@storybook/react';

import { LogoutForm } from "./LogoutForm";

export default {
  title: 'Account/LogoutForm',
  component: LogoutForm,
} as ComponentMeta<typeof LogoutForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof LogoutForm> = () => <LogoutForm />;
export const Default = Template.bind({});