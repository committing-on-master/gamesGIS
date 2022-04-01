import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ProfilesTable } from './ProfilesTable';
import { MapType } from '../../../../api/dto/types/MapType';

export default {
    title: 'profile/ProfilesTable',
    component: ProfilesTable,
} as ComponentMeta<typeof ProfilesTable>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction
const Template: ComponentStory<typeof ProfilesTable> = (props) => <ProfilesTable {...props}/>;

export const Primary = Template.bind({});
Primary.storyName = 'Primary';
Primary.args = {
    profiles: [
        {
            author: 'Vasya',
            name: 'Vasya in da woods',
            type: MapType.Woods,
            views: 51
        },
        {
            author: 'GreenWarrior',
            name: 'Green room',
            type: MapType.Labs,
            views: 13
        },
        {
            author: 'Jager',
            name: 'stashes',
            type: MapType.Woods,
            views: 24
        }
    ]
};