import React from 'react';
import ResultBox from './ResultBox';

const Template = (args) => <ResultBox {...args} usingLink={false} />;

export const Primary = Template.bind({});

Primary.args = {
    results: [
        {
            URI: 'asd',
            Name: 'Forever ... (is a long time)',
            Artist: 'Halsey',
            Image: 'https://i.scdn.co/image/ab67616d0000b273309b0cb81728d42a6dfb2b81',
            Count: '1',
        },
        {
            URI: 'asd2',
            Name: 'Forever ... (is a long time)',
            Artist: 'Halsey',
            Image: 'https://i.scdn.co/image/ab67616d0000b273309b0cb81728d42a6dfb2b81',
            Count: '1',
        },
        {
            URI: 'asd3',
            Name: 'Forever ... (is a long time)',
            Artist: 'Halsey',
            Image: 'https://i.scdn.co/image/ab67616d0000b273309b0cb81728d42a6dfb2b81',
            Count: '1',
        },
        {
            URI: 'asd4',
            Name: 'Forever ... (is a long time)',
            Artist: 'Halsey',
            Image: 'https://i.scdn.co/image/ab67616d0000b273309b0cb81728d42a6dfb2b81',
            Count: '1',
        },
        {
            URI: 'asd5',
            Name: 'Forever ... (is a long time)',
            Artist: 'Halsey',
            Image: 'https://i.scdn.co/image/ab67616d0000b273309b0cb81728d42a6dfb2b81',
            Count: '1',
        },
        {
            URI: 'asd6',
            Name: 'Forever ... (is a long time)',
            Artist: 'Halsey',
            Image: 'https://i.scdn.co/image/ab67616d0000b273309b0cb81728d42a6dfb2b81',
            Count: '1',
        },
        {
            URI: 'asd7',
            Name: 'Forever ... (is a long time)',
            Artist: 'Halsey',
            Image: 'https://i.scdn.co/image/ab67616d0000b273309b0cb81728d42a6dfb2b81',
            Count: '1',
        },
    ],
};

export default {
    title: 'ResultBox',
    component: ResultBox,
};
