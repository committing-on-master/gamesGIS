import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { MarkerIcon } from './MarkerIcon';
import { PopupStory } from './MarkerPopup/MarkerPopup.stories';
import { MarkerPopupProps } from './MarkerPopup';

export default {
    title: 'Content/MarkerIcon',
    component: MarkerIcon,
    decorators: [
        (Story) => (
            <div style={{position: 'relative'}}>
                <Story />
            </div>
        )
    ]
} as ComponentMeta<typeof MarkerIcon>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction
const Template: ComponentStory<typeof MarkerIcon> = (props) => <MarkerIcon {...props}/>;

const imgUrl = `${process.env.PUBLIC_URL}/img/altyn-pepe.png`;

export const Primary = Template.bind({});
Primary.storyName = 'Primary';
Primary.args = {
    iconUrl: imgUrl
}

export const Secondary = Template.bind({});
Secondary.storyName = 'Secondary';
Secondary.args = {
    iconUrl: imgUrl,
    top: 100,
    left: 300,
    popUp: <PopupStory {...PopupStory.args as MarkerPopupProps}/>
}