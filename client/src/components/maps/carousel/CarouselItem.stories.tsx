import { ComponentStory, ComponentMeta } from '@storybook/react';

import { CarouselItem } from "./CarouselItem"

export default {
    title: 'Map/CarouselItem',
    component: CarouselItem,
} as ComponentMeta<typeof CarouselItem>;

const Template: ComponentStory<typeof CarouselItem> = (props) => <CarouselItem {...props} />;

export const Primary = Template.bind({});
Primary.args = { id: "woods" };
