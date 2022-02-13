import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { EditSpanComponent } from './EditSpanComponent';

export default {
    title: 'shared/EditSpanComponent',
    component: EditSpanComponent,
} as ComponentMeta<typeof EditSpanComponent>;

const Template: ComponentStory<typeof EditSpanComponent> = (args) => <EditSpanComponent {...args} />;

export const Primary = Template.bind({});
