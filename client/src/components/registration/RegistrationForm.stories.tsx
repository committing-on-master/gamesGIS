import { ComponentStory, ComponentMeta } from '@storybook/react';
import fetchMock from 'fetch-mock';
import { RegistrationForm } from './RegistrationForm';
import { ErrorDTO } from '../../api/dto/response/ErrorDTO';

export default {
    title: 'registration/RegistrationForm',
    component: RegistrationForm,
} as ComponentMeta<typeof RegistrationForm>;

const Template: ComponentStory<typeof RegistrationForm> = (props) => <RegistrationForm {...props} />;

export const NameError = Template.bind({});
NameError.args = { endPoint: "users/nameError" }
NameError.play = () => {
    const errorBody: ErrorDTO = {
        errors: [{ param: "name", msg: "This name already in use"}]
    }
    fetchMock
        .restore()
        .post(
            "http://localhost:3000/users/nameError",
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(errorBody)
            }
        )
}

export const EmailError = Template.bind({});
EmailError.args = { endPoint: "users/emailError" }
EmailError.play = () => {
    const errorBody: ErrorDTO = {
        errors: [{ param: "email", msg: "This email already in use"}]
    }
    fetchMock
        .restore()
        .post(
            "http://localhost:3000/users/emailError",
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(errorBody)
            }
        )
}

export const PasswordError = Template.bind({});
PasswordError.args = { endPoint: "users/passwordError" }
PasswordError.play = () => {
    const errorBody: ErrorDTO = {
        errors: [{ param: "password", msg: "This password is something-something error"}]
    }
    fetchMock
        .restore()
        .post(
            "http://localhost:3000/users/passwordError",
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(errorBody)
            }
        )
}

export const FailureNetworkError = Template.bind({});
FailureNetworkError.args = { endPoint: "users/NetworkError" }
FailureNetworkError.play = () => {
    fetchMock
        .restore()
        .post(
            "http://localhost:3000/users/NetworkError",
            {
                throws: new Error("DNS blah-blah something")
            },
            {
                delay: 250
            }
        )
}