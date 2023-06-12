import React, { useEffect, useState} from 'react'
import { Container, Row, Col, Pagination } from 'react-bootstrap'
import { ReadStarRating } from './StarRating'

import '../pages/accom-style.css';
import { FaDraft2Digital } from 'react-icons/fa';

// TODO: (Jemu) - fix style
// TODO: Add scrollbar when review is too long for consistent review sizes
const ReviewTileItem = ({ data }) => {
    const [user, setUser] = useState(""); // Define state variable
    const jwt = localStorage.getItem("token");

    
    try {
        useEffect(() => {
            fetch(`/api/v1/auth-required-func/${data.user}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`
                },
            })
                .then(res => res.json())
                .then(data1 => {
                    setUser(data1.fname + " " + data1.lname)
                    });
            }, []);
    }
    catch {
        console.log("Error")
    }
    
    const dateTime = new Date(data.createdAt)

    const date = dateTime.toLocaleDateString(); // Get the date portion
    const time = dateTime.toLocaleTimeString(); // Get the time portion

    console.log("Data ", data)
    return(
        <Container className='d-flex justify-content-center'>
            <Row key={data._id}>
                <Col style={{background: "white"  }} className='border rounded border-1 border-primary d-flex flex-column justify-content-start'>
                    <ReadStarRating rate={data} />
                    <p className='my-4'>{data.detail}</p>
                    <h6><b>{data.fname} {data.lname}</b></h6>
                    <p>{date}, {time}</p>
                    
                </Col>
            </Row>
        </Container>
    )
}


const ReviewList = ({ data }) => {
    console.log(data.review)
    const [reviewData, setreviewData] = useState(data.review);
    

    const ReviewList = reviewData && reviewData.map(data => <ReviewTileItem key={ data } data={data} />)


    // TODO: Add function to pagination
    let active = 1;
    let max = 1;
    let items = [];
    for (let number = 1; number <= max; number++) {
    items.push(
        <Pagination.Item key={number} active={number === active}>
        {number}
        </Pagination.Item>,
    );
    }

    return (
        <>
            {/* <span className='ms-5'>Review</span> */}
            <Container className='d-flex flex-column align-items-center m-auto mt-4 pb-2'>
                <Row>{ReviewList}</Row>
                <Row className='mt-3'><Pagination>{items}</Pagination></Row>  
            </Container>
        </>
    )

}



export default ReviewList