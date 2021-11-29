import { ComponentStory, ComponentMeta } from '@storybook/react';

import { LoginForm } from "./LoginForm";

export default {
  title: 'Account/LoginForm',
  component: LoginForm,
} as ComponentMeta<typeof LoginForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof LoginForm> = () => <LoginForm />;
export const Default = Template.bind({});