import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { UserName } from "./UserName";

export default {
  title: 'Account/UserName',
  component: UserName,
} as ComponentMeta<typeof UserName>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof UserName> = (props) => <UserName {...props}/>;

export const anonymous = Template.bind({});
anonymous.args = {};

export const shortName = Template.bind({});
shortName.args = {userName: "Kup"};

export const wideName = Template.bind({});
wideName.args = {userName: "Billy Herrington"};