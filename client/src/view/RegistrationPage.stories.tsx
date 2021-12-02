import { ComponentStory, ComponentMeta } from '@storybook/react';
import fetchMock from 'fetch-mock';
import { loremIpsum } from 'lorem-ipsum';

import { RegistrationPage } from "./RegistrationPage";

export default {
    title: 'registration/RegistrationPage',
    component: RegistrationPage,
} as ComponentMeta<typeof RegistrationPage>;

const Template: ComponentStory<typeof RegistrationPage> = (props) => <RegistrationPage {...props} />;

export const SuccessLoad = Template.bind({});
// SuccessLoad.args = { endPoint: "SuccessLoad" }
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