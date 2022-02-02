import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { AwaitingComponent } from './AwaitingComponent';

export default {
    title: 'shared/AwaitingComponent',
    component: AwaitingComponent,
} as ComponentMeta<typeof AwaitingComponent>;

const Template: ComponentStory<typeof AwaitingComponent> = (args) => <AwaitingComponent {...args} />;

export const Primary = Template.bind({});

export const Small = Template.bind({});
Small.args = { size: "small", children: <p>I will succeed, all I need is more time xD</p> }

export const Medium = Template.bind({});
Medium.args = { size:"medium", children: <p>I will succeed, all I need is more time xD</p> }

export const Large = Template.bind({});
Large.args = { size: "large", children: <p>I will succeed, all I need is more time xD</p> }