import { ComponentStory, ComponentMeta } from '@storybook/react';
import { loremIpsum } from 'lorem-ipsum';
import { SidePanel } from "./SidePanel";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Navbar/SidePanel',
  component: SidePanel,
} as ComponentMeta<typeof SidePanel>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof SidePanel> = (args) => <SidePanel {...args}/>;

export const Primary = Template.bind({});
Primary.args = {
  header: "Header",
  visibility: true,
  children: <p>{loremIpsum({ count: 1, format: 'plain', suffix: "\r\n", units: 'paragraphs' })}</p>
}

export const Secondary = Template.bind({});
Secondary.args = {
  visibility: true,
  children: <p>{loremIpsum({ count: 2, format: 'plain', suffix: "\r\n", units: 'paragraphs' })}</p>
}