import React from 'react'
import FaveTileItem from './FaveTileItem'
import { useState, useEffect } from 'react';

const FaveTileList = () => {

    const [accommData, setAccommData] = useState({});
    
    useEffect(() => {
        fetch("/api/v1/accommodation/all")
        .then(res =>res.json())
        .then(data => {
            setAccommData(data);
            console.log(data["accommodations"][2]);
        })
    }, []);

    const LodgingList = accommData.accommodations && accommData.accommodations.map(data => <FaveTileItem key={data.id} data={data} />)

    return (
        <>
            {LodgingList}
        </>
    )
}

export default FaveTileList