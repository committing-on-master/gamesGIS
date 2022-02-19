import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { AgreementContainer } from './AgreementContainer';
import { RequestWrapper } from '../../../api/JsonRequestWrapper';
import { AgreementDTO } from '../../../api/dto/response/AgreementDTO';
import { loremIpsum } from 'lorem-ipsum';
import fetchMock from 'fetch-mock';
import { ErrorDTO } from '../../../api/dto/response/ErrorDTO';

export default {
    title: 'Agreement/License/3.Container',
    component: AgreementContainer,
} as ComponentMeta<typeof AgreementContainer>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction
const Template: ComponentStory<typeof AgreementContainer> = (props) => <AgreementContainer {...props}/>;

export const Primary = Template.bind({});
Primary.storyName = 'Primary 1,5 sec delay';
Primary.play = () => {
    const response: AgreementDTO = {
        message: 'ok',
        payload: {
            version: 1,
            agreementText: loremIpsum({ count: 5, format: 'plain', suffix: "\r\n", units: 'paragraphs' })
        }
    }
    fetchMock
        .restore()
        .get(
            RequestWrapper.getUrl('agreement'),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response)
            },
            {
                delay: 1500
            }
        )
}

export const LongLoading = Template.bind({});
LongLoading.storyName = '1 hour spinner';
LongLoading.play = () => {
    const response: AgreementDTO = {
        message: 'ok',
        payload: {
            version: 1,
            agreementText: loremIpsum({ count: 5, format: 'plain', suffix: "\r\n", units: 'paragraphs' })
        }
    }
    fetchMock
        .restore()
        .get(
            RequestWrapper.getUrl('agreement'),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response)
            },
            {
                delay: 60 * 60 * 1000
            }
        )
}

export const Second = Template.bind({});
Second.storyName = '404 error';
Second.play = () => {
    fetchMock
        .restore()
        .get(
            RequestWrapper.getUrl('agreement'),
            {
                status: 404,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({})
            },
        )
}

export const Third = Template.bind({});
Third.storyName = '500 error';
Third.play = () => {
    const response: ErrorDTO = {
        message: "500 internal error"
    }
    fetchMock
        .restore()
        .get(
            RequestWrapper.getUrl('agreement'),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response)
            },
        )
}