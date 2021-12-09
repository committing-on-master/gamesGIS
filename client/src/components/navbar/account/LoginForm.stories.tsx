import { ComponentStory, ComponentMeta } from '@storybook/react';
import fetchMock from 'fetch-mock';
import { ErrorDTO } from '../../../api/dto/response/ErrorDTO';
import { JwtDTO } from '../../../api/dto/response/JwtDTO';

import { LoginForm } from "./LoginForm";

export default {
  title: 'Account/LoginForm',
  component: LoginForm
} as ComponentMeta<typeof LoginForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof LoginForm> = () => <LoginForm />;

export const SuccessLogin = Template.bind({});
SuccessLogin.play = () => {
  const resultBody: JwtDTO = {
    msg: "successfully login",
    payload: {
      accessToken: "totallySuccess",
      refreshToken: "totallyRefresh"
    }
  }
  
  fetchMock
    .restore()
    .get(
      `http://localhost:3000/auth`,
      {
        status: 200,
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(resultBody)
      }
    )
}

export const Failure = Template.bind({});
Failure.play = () => {
  const resultBody: ErrorDTO = {
    msg: "Invalid email or password",
  }
  
  fetchMock
    .restore()
    .get(
      `http://localhost:3000/auth`,
      {
        status: 403,
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(resultBody)
      }
    )
}