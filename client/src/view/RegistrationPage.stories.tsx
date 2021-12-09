import { ComponentStory, ComponentMeta } from '@storybook/react';
import fetchMock from 'fetch-mock';
import { loremIpsum } from 'lorem-ipsum';

import { RegistrationPage } from "./RegistrationPage";

export default {
    title: 'Pages/Registration',
    component: RegistrationPage,
} as ComponentMeta<typeof RegistrationPage>;

const Template: ComponentStory<typeof RegistrationPage> = () => <RegistrationPage />;

export const SuccessLoad = Template.bind({});
SuccessLoad.play = () => {
    fetchMock
        .restore()
        .get(
            "http://localhost:3000/agreement",
            {
                status: 200,
                headers: { "Content-Type": "application/json" },

                body: JSON.stringify({
                    msg: "Successfully loaded",
                    payload: {
                        version: 1.3,
                        agreementText: loremIpsum({ count: 5, format: 'plain', suffix: "\r\n", units: 'paragraphs' })
                    }
                })
            }
        )
}