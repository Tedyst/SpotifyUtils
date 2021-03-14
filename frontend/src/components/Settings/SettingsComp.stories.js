import React from 'react';
import SettingsComp from './SettingsComp';

const Template = (args) => <SettingsComp {...args} />;

export const Primary = Template.bind({});

Primary.args = {
    originalSettings: {
        RecentTracks: true,
    },
    CSRFToken: 'asd',
};

export default {
    title: 'Settings',
    component: SettingsComp,
};
