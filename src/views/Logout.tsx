import React, { useEffect } from 'react';
import {
  setLogged,
} from '../store/user';
import { useDispatch } from 'react-redux';

export default function Track(){
    const dispatch = useDispatch();

    useEffect(() => {
        fetch('/api/logout', { cache: "no-store" }).then(res => res.json()).then(data => {
            dispatch(setLogged(false));
            localStorage.clear();
        });
        
    })
    return <div>Logging out...</div>;
}