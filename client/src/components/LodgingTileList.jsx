import React from 'react'
import LodgingTileItem from './LodgingTileItem'
import { useState, useEffect } from 'react';

const LodgingTileList = () => {

    const [accommData, setAccommData] = useState({});
    
    useEffect(() => {
        fetch("/api/v1/accommodation")
        .then(res =>res.json())
        .then(data => {
            setAccommData(data);
            console.log(data["accommodations"][2]);
        })
    }, []);

    const LodgingList = accommData.accommodations && accommData.accommodations.map(data => <LodgingTileItem key={data.id} data={data} />)

    return (
        <>
            {LodgingList}
        </>
    )
}

export default LodgingTileList