import React from 'react';
import BarGraph from './BarGraph';

const Template = (args) => <BarGraph {...args} />;

export const Primary = Template.bind({});

Primary.args = {
    acousticness: '21',
    danceability: '10',
    energy: '0.1',
    instrumentalness: '0',
    liveness: '10',
    loudness: '12',
    speechiness: '12',
};

export default {
    title: 'BarGraph',
    component: BarGraph,
};
