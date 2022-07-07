import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { loremIpsum } from "lorem-ipsum";

import { MarkerPopup } from './MarkerPopup';

export default {
    title: 'Content/MarkerIcon/MarkerPopup',
    component: MarkerPopup,
    decorators: [
        (Story) => (
            <div style={{
                paddingLeft: '300px'
            }}>
                <Story />
            </div>
        )
    ]
} as ComponentMeta<typeof MarkerPopup>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction
const Template: ComponentStory<typeof MarkerPopup> = (props) => <MarkerPopup {...props}/>;

export const PopupStory = Template.bind({});
PopupStory.storyName = 'Primary';
PopupStory.args = {
    header: 'Header',
    text: loremIpsum({units: 'sentences', count: 2, format: 'plain'})
}
