import React from 'react';
import Lyrics from './Lyrics';

const Template = (args) => <Lyrics {...args} />;

export const Primary = Template.bind({});

Primary.args = {
    // eslint-disable-next-line no-multi-str
    lyrics: 'asdsadasdasd\n\
asdasdsadsad\n\
asd\n\
asdsa\n\
das\n\
d',
};

export default {
    title: 'Lyrics',
    component: Lyrics,
};
