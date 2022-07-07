import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { FilledArea } from './FilledArea';

export default {
    title: 'Content/FilledArea',
    component: FilledArea,
} as ComponentMeta<typeof FilledArea>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction
const Template: ComponentStory<typeof FilledArea> = (props) => <FilledArea {...props} />;

export const Primary = Template.bind({});
Primary.storyName = 'Primary';
Primary.args = {
    height: 500,
    width: 500,
    areas: [
        {
            points: [
                { x: 100, y: 100 },
                { x: 170, y: 100 },
                { x: 200, y: 130 },
                { x: 170, y: 200 },
                { x: 80, y: 200 }
            ],
            colorRGBA: 'rgb(200, 0, 0, 0.3)'
        }
    ]
}
