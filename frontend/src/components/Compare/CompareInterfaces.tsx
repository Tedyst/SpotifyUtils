export interface UsernameInterface {
    Initiator: Initiator;
    Target: Initiator;
    Result: Result;
    Success: boolean;
    Error?: string;
}

export interface NoUsernameCompareInterface {
    Friends: Friend[] | null;
    Success: boolean;
    Code: string;
    Error?: string;
}

export interface Initiator {
    Username: string;
    Name: string;
    Image: string;
    Code: string;
}

export interface Result {
    Artists: Artist[] | null;
    Tracks: Track[] | null;
    Genres: string[] | null;
    Score: number;
}

export interface Artist {
    Name: string;
    Image: string;
    ID: string;
    URI: string;
}

export interface Track {
    Artist: string;
    Name: string;
    Image: string;
    ID: string;
    Duration: number;
    PreviewURL: string;
}

export interface Friend {
    Username: string;
    Name: string;
    Image: string;
    Code: string;
}
