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

const AddToBookmarks = ({ bId }) => {
    const type = localStorage.getItem("userType");
    const id = localStorage.getItem("_id");
    const jwt = localStorage.getItem("token");

    const [fetchedData, setFetchedData] = useState([]);
    const [containsValue, setContainsValue] = useState(false);

    useEffect(() => {
        try {
            fetch(`/api/v1/auth-required-func/${type}/bookmark/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization : `Bearer ${jwt}`
                },
            })
            .then(res =>res.json())
            .then(data => {
                console.log(data);
                setFetchedData(data);
            })
        } catch (err) {
            console.log(err);
        }
    }, []);

    useEffect(() => {
        try {
            if (fetchedData.some(item => item._id === bId)) {
                setContainsValue(true);
            } else {
                setContainsValue(false);
            }
        } catch (err) {
            setContainsValue(true);
        }
        
        console.log(containsValue);
    }, [fetchedData]);

    function addBookmark() { 
        console.log(`Trying to add bookmark with id ${bId}`);
        fetch(`/api/v1/auth-required-func/${type}/bookmark/${bId}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
                body: JSON.stringify(bId),
        })
            .then((response) => response.json())
            .then((body) => {
                console.log(body);
        });
    };

    if (type && containsValue == false) {
        return(
            <div className="map" style={{ margin: '0px', padding: '0px' }}>
                <Button type="button" onClick={addBookmark} variant="light">Bookmark</Button>
            </div>
        );
    } else if (type && containsValue === true) {
        return(
            <p>Already Bookmarked.</p>
        );
    } else {
        return(
            <p>Please log-in to bookmark!</p>
        );
    }
    
}
 
const Details = (data) => {
    return (
        <Container id="desc_accom" className="border-bottom pb-4">
            <Row>
                <Col lg={4} md={5} sm={6} xs={7}>
                    <h3>{data.accomData.name}</h3>
                </Col>
                <Col lg={6} md={7} sm={6} xs={5}>
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
                    <AddToBookmarks bId={data.accomData._id}/>
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


function Accommodation(props) {
    const location = useLocation();

    return (<>
        <Slideshow />
        {/* <ReadStarRating rate={location.state.data} /> */}
        <Details accomData={location.state.data} />
        <ReviewList data={location.state.data} />
    </>
    );
}

export default Accommodation;