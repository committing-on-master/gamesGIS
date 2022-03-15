import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { AgreementContainer } from './AgreementContainer';
import { RequestWrapper } from '../../../api/JsonRequestWrapper';
import { AgreementDTO } from '../../../api/dto/response/AgreementDTO';
import { loremIpsum } from 'lorem-ipsum';
import { rest } from 'msw';

export default {
    title: 'Agreement/License/3.Container',
    component: AgreementContainer,
} as ComponentMeta<typeof AgreementContainer>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction
const Template: ComponentStory<typeof AgreementContainer> = (props) => <AgreementContainer {...props}/>;

export const Primary = Template.bind({});
Primary.storyName = 'Primary 1,5 sec delay';
Primary.parameters = {
    msw: {
        handlers: [
            rest.get(
                RequestWrapper.getUrl('agreement'),
                (req, res, ctx) => {
                    const response: AgreementDTO = {
                        message: 'ok',
                        payload: {
                            version: 1,
                            agreementText: loremIpsum({ count: 5, format: 'plain', suffix: "\r\n", units: 'paragraphs' })
                        }
                    }
                    return res(
                        ctx.delay(1500),
                        ctx.status(200),
                        ctx.json(response)
                    );
                }
            )
        ]
    }
}

export const Second = Template.bind({});
Second.storyName = '404 error';
Second.parameters = {
    msw: {
        handlers: [
            rest.get(
                RequestWrapper.getUrl('agreement'),
                (req, res, ctx) => {
                    return res(
                        ctx.status(404, 'Agreement not found'),
                        ctx.json({})
                    );
                }
            )
        ]
    }
}

export const Third = Template.bind({});
Third.storyName = '500 error';
Third.parameters = {
    msw: {
        handlers: [
            rest.get(
                RequestWrapper.getUrl('agreement'),
                (req, res, ctx) => {
                    return res(
                        ctx.status(500, 'something broke'),
                        ctx.json({})
                    );
                }
            )
        ]
    }
}