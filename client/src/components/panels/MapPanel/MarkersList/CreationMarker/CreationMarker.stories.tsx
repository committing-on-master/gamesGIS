import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { CreationMarker } from './CreationMarker';

export default {
    title: 'MarkersList/CreationMarker',
    component: CreationMarker,
} as ComponentMeta<typeof CreationMarker>;

const Template: ComponentStory<typeof CreationMarker> = (args) => <CreationMarker {...args} />;

export const Primary = Template.bind({});
