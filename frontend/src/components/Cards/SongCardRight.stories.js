import React from 'react';
import SongCardRight from './SongCardRight';

const Template = (args) => <SongCardRight {...args} />;

export const All = Template.bind({});
export const WithoutCount = Template.bind({});
export const WithoutDuration = Template.bind({});
export const WithoutDurationOrCount = Template.bind({});

All.args = {
    duration: '2 minutes',
    name: 'Forever ... (is a long time)',
    artist: 'Halsey',
    image: 'https://i.scdn.co/image/ab67616d0000b273309b0cb81728d42a6dfb2b81',
    count: '1',
};

WithoutCount.args = {
    duration: '2 minutes',
    name: 'Forever ... (is a long time)',
    artist: 'Halsey',
    image: 'https://i.scdn.co/image/ab67616d0000b273309b0cb81728d42a6dfb2b81',
};

WithoutDuration.args = {
    count: '1',
    name: 'Forever ... (is a long time)',
    artist: 'Halsey',
    image: 'https://i.scdn.co/image/ab67616d0000b273309b0cb81728d42a6dfb2b81',
};

WithoutDurationOrCount.args = {
    name: 'Forever ... (is a long time)',
    artist: 'Halsey',
    image: 'https://i.scdn.co/image/ab67616d0000b273309b0cb81728d42a6dfb2b81',
};

export default {
    title: 'SongCardRight',
    component: SongCardRight,
};
