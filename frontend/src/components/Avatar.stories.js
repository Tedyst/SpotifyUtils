import React from 'react';
import Avatar from './Avatar';

const Template = (args) => <Avatar {...args} />;

export const Primary = Template.bind({});
export const NoImage = Template.bind({});
export const NoNameOrImage = Template.bind({});
export const Dot = Template.bind({});

Primary.args = {
    image: 'https://i.scdn.co/image/ab6775700000ee85d22aba98a495d6c14bc56f30',
    name: 'Tedy',
};

NoImage.args = {
    image: '',
    name: 'Tedy',
};

NoNameOrImage.args = {
    image: '',
    name: '',
};

Dot.args = {
    image: '',
    name: '.',
};

export default {
    title: 'Avatar',
    component: Avatar,
};
