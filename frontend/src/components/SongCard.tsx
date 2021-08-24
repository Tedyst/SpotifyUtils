import React from 'react';

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
}
