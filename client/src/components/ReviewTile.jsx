import React, { useState} from 'react'
import { Container, Row, Col, Pagination } from 'react-bootstrap'
import { ReadStarRating } from './StarRating'

import '../pages/accom-style.css';

// TODO: (Jemu) - fix style
const ReviewTileItem = ({ data }) => {
    console.log("data rating" + data.rating)
    return(
        <Container>
            <Row key={data._id}>
                <Col style={{background: "white"  }} className='border rounded border-1 border-primary d-flex flex-column justify-content-start'>
                    <ReadStarRating rate={data} />
                    <p className='my-4'>{data.detail}</p>
                    <h6><b>Traveler</b></h6>
                    <p>Date of <b>review</b>: </p>
                    
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
    let items = [];
    for (let number = 1; number <= 5; number++) {
    items.push(
        <Pagination.Item key={number} active={number === active}>
        {number}
        </Pagination.Item>,
    );
    }

    return (
        <>
            {/* <span className='ms-5'>Review</span> */}
            <Container className='d-flex flex-column align-items-center m-auto'>
                <Row>{ReviewList}</Row>
                <Row className='mt-3'><Pagination>{items}</Pagination></Row>  
            </Container>
        </>
    )

}



export default ReviewList