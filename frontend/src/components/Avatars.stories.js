import React from 'react';
import Avatars from './Avatars';

const Template = (args) => <Avatars {...args} />;

export const Primary = Template.bind({});
export const Secondary = Template.bind({});

Primary.args = {
    target: {
        image: 'https://i.scdn.co/image/ab6775700000ee85d22aba98a495d6c14bc56f30',
        name: 'Tedy',
    },
    initiator: {
        image: '',
        name: 'tedy2',
    },
};

Secondary.args = {
    target: {
        image: '',
        name: 'Tedy',
    },
    initiator: {
        image: 'https://i.scdn.co/image/ab6775700000ee85d22aba98a495d6c14bc56f30',
        name: 'tedy2',
    },
};

export default {
    title: 'Avatars',
    component: Avatars,
};
