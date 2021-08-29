import React from 'react';
import SongCardLeft from './SongCardLeft';
import SongCardRight from './SongCardRight';
import SongCardUp from './SongCardUp';

export interface SongCardProps {
    duration?: number,
    name: string,
    artist: string,
    image?: string,
    count?: number,
    text?: string | React.ReactNode,
    noShadow?: boolean,
    uri?: string,
    usingLink?: boolean,
    fade?: boolean,
}

export default function SongCard(props: SongCardProps & { type: 'right' | 'left' | 'up' }) {
    const { type } = props;
    if (type === 'right') {
        return <SongCardRight {...props} />;
    }
    if (type === 'left') {
        return <SongCardLeft {...props} />;
    }
    if (type === 'up') {
        return <SongCardUp {...props} />;
    }
    return null;
}
