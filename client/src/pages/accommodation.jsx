import './accom-style.css';
import { Button, Row, Col, Carousel, Container } from 'react-bootstrap';
import React, { useState, useEffect } from "react";
import { ReadStarRating, StarRating } from '../components/StarRating';
import { useLocation } from 'react-router-dom';
import ReviewList from '../components/ReviewTile';

const Slideshow = () => {
    return (
        <Carousel>
            <Carousel.Item>
                <img src="https://hips.hearstapps.com/hmg-prod/images/sunset-quotes-21-1586531574.jpg?crop=1.00xw:0.752xh;0,0.0601xh&resize=1200:*"
                    alt="Picture 1" className="d-block" />
            </Carousel.Item>
            <Carousel.Item>
                <img src="https://img.freepik.com/free-vector/sunset-sunrise-ocean-nature-landscape_33099-2244.jpg?w=2000"
                    alt="Picture 2" className="d-block" />
            </Carousel.Item>
            <Carousel.Item>
                <img src="https://cms.accuweather.com/wp-content/uploads/2017/05/sunset.jpg" alt="Picture 3"
                    className="d-block" />
            </Carousel.Item>
        </Carousel>
    );
}

const Details = (data) => {
    return (
        <Container className="desc_accom">
            <h3 className='accomTitle'>{data.accomData.name}</h3>
            <Row className="accomRating">
                <Col className='' lg={1}>
                 <h5 className='ratingTitle'>Rating: </h5>
                </Col>
                <Col>
                    <ReadStarRating rate={data.accomData} />
                </Col>
            </Row>

            <p id="accommDetail">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                culpa qui officia deserunt mollit anim id est laborum.</p>
            <Row id="location" className="detail">
                <Col sm={1}>
                    <img src="../../assets/icons/location.jpg" alt="test1" />
                </Col>
                <Col sm={9}>
                    <p>{data.accomData.location}</p>
                </Col>
                <Col sm={2}>
                    <div className="map" style={{ margin: '0px', padding: '0px' }}>
                        <Button type="button">View Map</Button>
                    </div>
                </Col>
            </Row>
            <Row id="price" className="detail">
                <Col sm={1}>
                    <img src="../../assets/icons/price.jpg" alt="test2" />
                </Col>
                <Col sm={11}>
                    {
                        data.accomData.price.length == 1 ?
                            <p >Php {data.accomData.price[0]} per month</p>
                            :
                            <p >Php {data.accomData.price[0]} - Php {data.accomData.price[1]} per month</p>
                    }
                </Col>
            </Row>
            <Row id="calendar" className="detail">
                <Col sm={1}>
                    <img src="../../assets/icons/calendar.jpg" alt="test3" />
                </Col>
                <Col sm={11}>
                    <p>Application Starts on July 2023</p>
                </Col>
            </Row>
        </Container>
    );
}


const Review = (data) => {
    return(
        <Container className='desc_accom reviewContainer'>
            <h3 className='reviewTitle'>Reviews:</h3>
            <ReviewList data={data.reviewData} />
        </Container>
    );
}

function Accommodation(props) {
    const location = useLocation()

    return (<>
        <Slideshow />
        {/* <ReadStarRating rate={location.state.data} /> */}
        <Details accomData={location.state.data} />
        <Review reviewData={location.state.data} />
    </>
    );
}

export default Accommodation;