import { ComponentStory, ComponentMeta } from '@storybook/react';

import { NoMatchPage } from "./NoMatchPage";

export default {
  title: '404/NoMatchPage',
  component: NoMatchPage,
} as ComponentMeta<typeof NoMatchPage>;

const Template: ComponentStory<typeof NoMatchPage> = () => <NoMatchPage/>;

export const Primary = Template.bind({});
