import { ComponentStory, ComponentMeta } from '@storybook/react';
import fetchMock from 'fetch-mock';
import { loremIpsum } from 'lorem-ipsum';

import { LicenseAgreement } from "./LicenseAgreement";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'registration/LicenseAgreement',
    component: LicenseAgreement,
} as ComponentMeta<typeof LicenseAgreement>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof LicenseAgreement> = (props) => <LicenseAgreement {...props} />;

export const SuccessLoad = Template.bind({});
SuccessLoad.args = { endPoint: "SuccessLoad" }
SuccessLoad.play = () => {
    fetchMock
        .restore()
        .get(
            "http://localhost:3000/SuccessLoad",
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

export const SuccessLoad4sDelay = Template.bind({});
SuccessLoad4sDelay.args = { endPoint: "SuccessLoad4sDelay" }
SuccessLoad4sDelay.play = () => {
    fetchMock
        .restore()
        .get(
            "http://localhost:3000/SuccessLoad4sDelay",
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
            },
            {
                delay: 4000
            }
        )
}