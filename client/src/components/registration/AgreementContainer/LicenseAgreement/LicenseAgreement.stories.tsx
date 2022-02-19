import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { LicenseAgreement } from './LicenseAgreement';
import { Primary as TextStory, Secondary as LongTextStory } from '../AgreementText/AgreementText.stories';
import type { AgreementTextProps } from '../AgreementText';
import { ProcessState } from '../../../../hocs/withWaiter'

export default {
    title: 'Agreement/License/2.Form',
    component: LicenseAgreement,
    subcomponents: { TextStory, LongTextStory }
} as ComponentMeta<typeof LicenseAgreement>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction
const Template: ComponentStory<typeof LicenseAgreement> = (props) => <LicenseAgreement {...props} />;

export const Primary = Template.bind({});
Primary.storyName = 'Loaded';
Primary.args = {
    state: ProcessState.Succeeded,
    children: <TextStory {...TextStory.args as AgreementTextProps} />
}

export const LongAgreement = Template.bind({});
LongAgreement.storyName = 'Loaded long agreement';
LongAgreement.args = {
    state: ProcessState.Succeeded,
    children: <LongTextStory {...LongTextStory.args as AgreementTextProps} />
}

export const Loading = Template.bind({});
Loading.storyName = 'Loading';
Loading.args = {
    state: ProcessState.Loading,
    children: <p style={{width: '100%', textAlign: 'center'}}>Loading state ...</p>
}

export const Error = Template.bind({});
Error.storyName = 'Error';
Error.args = {
    state: ProcessState.Failed,
    children: <p style={{width: '100%', textAlign: 'center'}}>Total Failed ...</p>
}