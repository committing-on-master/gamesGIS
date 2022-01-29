import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ModalImage } from "./ModalImage"

export default {
    title: 'Map/ModalImage',
    component: ModalImage,
} as ComponentMeta<typeof ModalImage>;

const Template: ComponentStory<typeof ModalImage> = (props) => <ModalImage {...props} />;

// примеру нужен рабочий урл на изображение
// export const Primary = Template.bind({});
// Primary.args = { imgUrl: "http://localhost:3000/woods_full.png" };
