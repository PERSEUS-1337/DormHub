import React from 'react'
import LodgingTileItem from './LodgingTileItem'
import { useState, useEffect } from 'react';

const LodgingTileList = () => {
    // const temp_data = [
    //     {
    //         id: 1,
    //         name: "JUANITOS",
    //         price: 2000,
    //         rating: 4.7,
    //         img_src: "https://cdn.houseplansservices.com/product/tahbfmakhok6k787jtmjm3ecgt/w620x413.png?v=9",
    //     },
    //     {
    //         id: 2,
    //         name: "JUANITITAS",
    //         price: 4000,
    //         rating: 2.7,
    //         img_src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/315663049.jpg?k=bfa63b17927cc47fbeece382d0f520052eaefc592601ec7a9555685c01803949&o=&hp=1"
    //     },
    //     {
    //         id: 3,
    //         name: "EME",
    //         price: 1000,
    //         rating: 3.1,
    //         img_src: "https://media-cdn.tripadvisor.com/media/photo-s/0a/22/d6/51/peredo-s-loding-house.jpg"
    //     },
    // ]

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