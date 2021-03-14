import React from 'react';
import SongCardUp from './SongCardUp';

const Template = (args) => <SongCardUp {...args} usingLink={false} />;

export const WithCount = Template.bind({});
export const WithoutCount = Template.bind({});

WithCount.args = {
    uri: 'test',
    image: 'https://i.scdn.co/image/ab67616d0000b273309b0cb81728d42a6dfb2b81',
    name: 'Forever ... (is a long time)',
    artist: 'Halsey',
    count: '1',
};

WithoutCount.args = {
    uri: 'test',
    image: 'https://i.scdn.co/image/ab67616d0000b273309b0cb81728d42a6dfb2b81',
    name: 'Forever ... (is a long time)',
    artist: 'Halsey',
};

export default {
    title: 'SongCardUp',
    component: SongCardUp,
};
