import React from 'react';
import AlbumInfo from './AlbumInfo';

const Template = (args) => <AlbumInfo {...args} />;

export const Primary = Template.bind({});

Primary.args = {
    popularity: '2',
    releaseDate: '2020',
    tracks: '20',
    markets: '12',
};

export default {
    title: 'AlbumInfo',
    component: AlbumInfo,
};
