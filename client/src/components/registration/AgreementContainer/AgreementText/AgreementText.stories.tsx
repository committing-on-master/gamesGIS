import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { loremIpsum } from 'lorem-ipsum';

import { AgreementText } from './AgreementText';

export default {
    title: 'Agreement/License/1.Text',
    component: AgreementText,
} as ComponentMeta<typeof AgreementText>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction
const Template: ComponentStory<typeof AgreementText> = (props) => <AgreementText {...props}/>;

export const Primary = Template.bind({});
Primary.storyName = "Lorem ipsum scenario";
Primary.args = {
    text: loremIpsum({ count: 2, format: 'plain', suffix: "\r\n", units: 'paragraphs' })
}

export const Secondary = Template.bind({});
Secondary.storyName = "Long text scenario";
Secondary.args = {
    text: loremIpsum({ count: 15, format: 'plain', suffix: "\r\n", units: 'paragraphs' })
}
