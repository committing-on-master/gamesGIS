import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { UserElement } from "./UserElement";

export default {
  title: 'Account/UserElement',
  component: UserElement,
} as ComponentMeta<typeof UserElement>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserElement> = (props) => <UserElement {...props}/>;

export const notRegistered = Template.bind({});
notRegistered.args = {};

export const registered = Template.bind({});
registered.args = {userName: "Billy Herrington"};