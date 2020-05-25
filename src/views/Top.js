import React, { useState } from 'react';
import {
  selectTop,
  setTop
} from '../store/user';
import { useSelector, useDispatch } from 'react-redux';


export default function Top(props){
    const top = useSelector(selectTop);
    const [Updating, setUpdating] = useState(false);
    const dispatch = useDispatch();
    if(Object.keys(top["artists"]).length === 0 && Updating === false){
        setUpdating(true);
        fetch('/top/me').then(res => res.json()).then(data => {
            dispatch(setTop(data));
        });
    }
    console.log(top);
    return "Top";
}