import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AgreementText } from "./AgreementText";
import fetchMock from "fetch-mock"
import { loremIpsum } from "lorem-ipsum";

export default {
    title: 'registration/AgreementText',
    component: AgreementText,
    decorators: [(Story) =>
        <div>
            <Story />
        </div>]
} as ComponentMeta<typeof AgreementText>;

const Template: ComponentStory<typeof AgreementText> = (props) => <AgreementText {...props} />;

export const SuccessScenario = Template.bind({});
SuccessScenario.args = { endPoint: "SuccessScenario" }
SuccessScenario.play = () => {
    fetchMock
        .restore()
        .get(
            "http://localhost:3000/api/SuccessScenario",
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

export const Success3sDelay = Template.bind({});
Success3sDelay.args = { endPoint: "Success3sDelay" }
Success3sDelay.play = () => {
    fetchMock
        .restore()
        .get(
            "http://localhost:3000/api/Success3sDelay",
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
                delay: 3000
            }
        )
}

export const Faluire404 = Template.bind({});
Faluire404.args = { endPoint: "Faluire404" }
Faluire404.play = () => {
    fetchMock
        .restore()
        .get(
            "http://localhost:3000/api/Faluire404",
            {
                status: 404,
                headers: { "Content-Type": "application/json" },
                body:"{}"               
            },
            {
                delay: 500
            }
        )
}

export const Faluire500 = Template.bind({});
Faluire500.args = { endPoint: "Faluire500" }
Faluire500.play = () => {
    fetchMock
        .restore()
        .get(
            "http://localhost:3000/api/Faluire500",
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
                body:"{}"              
            },
            {
                delay: 500
            }
        )
}

export const FailureNetworkError = Template.bind({});
FailureNetworkError.args = { endPoint: "NetworkError" }
FailureNetworkError.play = () => {
    fetchMock
        .restore()
        .get(
            "http://localhost:3000/api/NetworkError",
            {
                throws: new Error("DNS blah-blah something")
            },
            {
                delay: 500
            }
        )
}