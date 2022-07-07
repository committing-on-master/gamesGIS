import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Anchor } from './Anchor';

export default {
    title: 'Content/Anchor',
    component: Anchor,
} as ComponentMeta<typeof Anchor>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction
const Template: ComponentStory<typeof Anchor> = (props) => <Anchor {...props}/>;

export const Primary = Template.bind({});
Primary.storyName = 'Primary';
Primary.args = { text: 'simple text' }