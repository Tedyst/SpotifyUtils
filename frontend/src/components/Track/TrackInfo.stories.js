import React from 'react';
import TrackInfo from './TrackInfo';

const Template = (args) => <TrackInfo {...args} />;

export const Primary = Template.bind({});

Primary.args = {
    popularity: '12',
    length: '1222',
    markets: '90',
    explicit: true,
    trackKey: '3',
    mode: '2',
    tempo: '1',
    timeSignature: '1',
};

export default {
    title: 'TrackInfo',
    component: TrackInfo,
};
