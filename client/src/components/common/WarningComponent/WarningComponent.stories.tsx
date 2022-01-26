import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { WarningComponent } from './WarningComponent';

export default {
    title: 'shared/WarningComponent',
    component: WarningComponent,
} as ComponentMeta<typeof WarningComponent>;

const Template: ComponentStory<typeof WarningComponent> = (args) => <WarningComponent {...args} />;

export const Primary = Template.bind({});
