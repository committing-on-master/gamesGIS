import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { AwaitingComponent } from './AwaitingComponent';

export default {
    title: 'shared/AwaitingComponent',
    component: AwaitingComponent,
} as ComponentMeta<typeof AwaitingComponent>;

const Template: ComponentStory<typeof AwaitingComponent> = (args) => <AwaitingComponent {...args} />;

export const Primary = Template.bind({});
