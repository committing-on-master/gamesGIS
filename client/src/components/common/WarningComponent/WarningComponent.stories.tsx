import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { WarningComponent } from './WarningComponent';

export default {
    title: 'shared/WarningComponent',
    component: WarningComponent,
} as ComponentMeta<typeof WarningComponent>;

const Template: ComponentStory<typeof WarningComponent> = (args) => <WarningComponent {...args} />;

export const Primary = Template.bind({});

export const Small = Template.bind({});
Small.args = { size: "small", children: <p>Sad but true</p> }

export const Medium = Template.bind({});
Medium.args = { size:"medium", children: <p>Sad but true</p> }

export const Large = Template.bind({});
Large.args = { size: "large", children: <p>Sad but true</p> }
