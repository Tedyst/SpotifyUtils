import React, {useState, useEffect} from 'react';
import ResultBox from '../components/ResultBox';
import Typography from '@material-ui/core/Typography';
import Loading from '../components/Loading';

export default function Recent() {
    const [Recent, setRecent] = useState<{
        results:{
            name: string,
            artist: string,
            lyrics: string,
            uri: string,
            image_url: string,
            preview_url: string
        }[],
        success: boolean
    }>();

    useEffect(() => {
        fetch('/api/recent', { cache: "no-store" }).then(res => res.json()).then(data => {
            setRecent(data);
        });
    }, [])

    if(Recent === undefined)
        return <Loading />
    return (
        <div>
        <Typography component="h4" variant="h4" align="center">
            Your recent tracks
        </Typography>
        <br />
        <ResultBox results={Recent.results}/>
        </div>
    )
}