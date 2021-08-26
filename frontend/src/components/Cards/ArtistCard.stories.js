import React from 'react';
import ArtistCard from './ArtistCard';

const Template = (args) => <ArtistCard {...args} />;

export const Primary = Template.bind({});
export const NoSong = Template.bind({});
export const NoImage = Template.bind({});
export const NoImageButBestSong = Template.bind({});

Primary.args = {
    bestSong: 'Forever ... (is a long time)',
    image: 'https://i.scdn.co/image/ab67616d0000b273309b0cb81728d42a6dfb2b81',
    name: 'Halsey',
};

NoSong.args = {
    bestSong: '',
    image: 'https://i.scdn.co/image/ab67616d0000b273309b0cb81728d42a6dfb2b81',
    name: 'Halsey',
};

NoImage.args = {
    bestSong: '',
    image: '',
    name: 'Halsey',
};

NoImageButBestSong.args = {
    bestSong: 'Forever ... (is a long time)',
    image: '',
    name: 'Halsey',
};

export default {
    title: 'ArtistCard',
    component: ArtistCard,
};
