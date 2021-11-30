import { ComponentStory, ComponentMeta } from '@storybook/react';
import { RegistrationForm } from './RegistrationForm';

export default {
    title: 'registration/RegistrationForm',
    component: RegistrationForm,
    // decorators: [(Story) =>
    //     <div className="modal-card">
    //         <Story />
    //     </div>]
} as ComponentMeta<typeof RegistrationForm>;

const Template: ComponentStory<typeof RegistrationForm> = (props) => <RegistrationForm {...props} />;

export const Primary = Template.bind({});