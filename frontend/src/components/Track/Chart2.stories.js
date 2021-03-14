import React from 'react';
import Chart2 from './Chart2';

const Template = (args) => <Chart2 {...args} />;

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
    title: 'Chart2',
    component: Chart2,
};
