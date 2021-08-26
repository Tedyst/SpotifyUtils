import React from 'react';
import PlaylistSearchBox from './PlaylistSearchBox';

const Template = (args) => <PlaylistSearchBox {...args} />;

export const Primary = Template.bind({});

Primary.args = {
    playlists: [
        {
            id: 'asd',
            name: 'asd',
        },
    ],
};

export default {
    title: 'PlaylistSearchBox',
    component: PlaylistSearchBox,
};
