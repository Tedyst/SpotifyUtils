export interface UsernameInterface {
    initiator: Initiator;
    target: Initiator;
    result: Result;
    success: boolean;
    error?: string;
}

export interface NoUsernameCompareInterface {
    friends: Friend[] | null;
    success: boolean;
    code: string;
    error?: string;
}

export interface Initiator {
    username: string;
    name: string;
    image: string;
    code: string;
}

export interface Result {
    artists: Artist[] | null;
    tracks: Track[] | null;
    genres: string[] | null;
    percent: number;
}

export interface Artist {
    name: string;
    image: string;
    id: string;
}

export interface Track {
    artist: string;
    name: string;
    image: string;
    id: string;
    duration: number;
    previewURL: string;
}

export interface Friend {
    username: string;
    name: string;
    image: string;
    code: string;
}
