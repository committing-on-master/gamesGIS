import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ProfileActions } from "./ProfileActions";

export default {
  title: 'profile/ProfileActions',
  component: ProfileActions,
} as ComponentMeta<typeof ProfileActions>;

const Template: ComponentStory<typeof ProfileActions> = (args) => <ProfileActions {...args}/>;

export const Primary = Template.bind({});
Primary.args = { record: {name: "Test", id: 1, creationDate: new Date(), map: 1, markersCount: 0} };
