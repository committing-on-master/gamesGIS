import { ComponentStory, ComponentMeta } from '@storybook/react';
import { EndPoints } from '../../../api/endPoints';

import { AreaChoicer, ChoicerAreaType } from "./AreaChoicer";

export default {
  title: 'profile/AreaChoicer',
  component: AreaChoicer,
  parameters: {
      layout: "centered"
  }
} as ComponentMeta<typeof AreaChoicer>;

const Template: ComponentStory<typeof AreaChoicer> = (args) => <AreaChoicer {...args}/>;

const previewUrl = (name: string) => `${process.env.PUBLIC_URL}/img/maps/${name}.png`;
const areas: ChoicerAreaType[] = [
    {
        map: 0,
        name:"shoreline",
        url: previewUrl("Shoreline")
    },
    {
        map: 1,
        name: "lighthouse",
        url: previewUrl("Lighthouse")
    },
    {
        map: 2,
        name: "customs",
        url: previewUrl("Customs")
    }
]
export const Primary = Template.bind({});
Primary.args = {areas: areas}