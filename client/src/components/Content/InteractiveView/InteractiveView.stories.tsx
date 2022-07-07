import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { InteractiveView } from './InteractiveView';

export default {
    title: 'Content/InteractiveView',
    component: InteractiveView,
} as ComponentMeta<typeof InteractiveView>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction
const Template: ComponentStory<typeof InteractiveView> = (props) => <InteractiveView {...props}/>;

const imgUrl = `${process.env.PUBLIC_URL}/img/fragment.png`;

export const Primary = Template.bind({});
Primary.storyName = 'Primary';
Primary.args = {
    imgUrl: imgUrl,
    width: 450,
    height: 450,

    points: [{
        location: {x: 25, y: 25},
        area: {
            colorRGBA: 'rgb(200, 0, 0, 0.3)',
            points: [
                {x: 50, y: 50},
                {x: 95, y: 50},
                {x: 50, y: 95},
            ]
        }
    }]
}
