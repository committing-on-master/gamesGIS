import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Sidenav } from "./Sidenav";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Navbar/Sidenav',
  component: Sidenav,
} as ComponentMeta<typeof Sidenav>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Sidenav> = (args) => <Sidenav {...args}/>;

export const Primary = Template.bind({});
Primary.args = {
  header: "Header",
  visibility: true,
  children: <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
}