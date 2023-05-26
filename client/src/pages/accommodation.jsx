import './accom-style.css';
import { Button, Row, Col, Carousel, Container, Modal } from 'react-bootstrap';
import React, { useState, useEffect } from "react";
import { ReadStarRating, StarRating } from '../components/StarRating';
import { useLocation } from 'react-router-dom';
import ReviewList from '../components/ReviewTile';

const Slideshow = () => {
    const [modalShow, setModalShow] = React.useState(false);
    const [imgSrc, setImgSrc] = React.useState();

    function setupModal(src) {
        setModalShow(true);
        setImgSrc(src);
    }

    return (
        <>
            <Carousel>
                <Carousel.Item onClick={() => setupModal("https://uplbperspective.files.wordpress.com/2020/03/img_0070.jpg?w=950")}>
                    <img src="https://uplbperspective.files.wordpress.com/2020/03/img_0070.jpg?w=950"
                        alt="Picture 1" className="d-block" />
                </Carousel.Item>
                <Carousel.Item onClick={() => setupModal("https://collegelifemadeeasy.com/wp-content/uploads/2022/06/cool-dorm-room-stuff-decorating-ideas-Facebook.jpg")}>
                    <img src="https://collegelifemadeeasy.com/wp-content/uploads/2022/06/cool-dorm-room-stuff-decorating-ideas-Facebook.jpg"
                        alt="Picture 2" className="d-block" />
                </Carousel.Item>
                <Carousel.Item onClick={() => setupModal("https://www.suidersee.co.za/media/cache/67/e6/67e6f48c4a41d0c53fedffc1190f5ea0.jpg")}>
                    <img src="https://www.suidersee.co.za/media/cache/67/e6/67e6f48c4a41d0c53fedffc1190f5ea0.jpg" alt="Picture 3"
                        className="d-block" />
                </Carousel.Item>
                <Carousel.Item onClick={() => setupModal("https://www.une.edu/sites/default/files/styles/block_image_large/public/2020-12/Avila-6259.jpg?itok=5HTs3fnj")}>
                    <img src="https://www.une.edu/sites/default/files/styles/block_image_large/public/2020-12/Avila-6259.jpg?itok=5HTs3fnj" alt="Picture 4"
                        className="d-block" />
                </Carousel.Item>
            </Carousel>
            <ImageModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                imgSrc={imgSrc}
            />
        </>

    );
}

function ImageModal(props) {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body closeButton>
                <img src={props.imgSrc} />
            </Modal.Body>
        </Modal>
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

            <Row id="amenity" className="detail">
                <Col sm={1}>
                    <img src="../../assets/icons/amenities.jpg" alt="test4" />
                </Col>
                <Col sm={11}>
                    <p>
                        {data.accomData.amenity.map((amenity) => {
                            return amenity + ", ";
                        })}
                    </p>
                </Col>
            </Row>
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


const Review = (data) => {
    return (
        <Container className='desc_accom reviewContainer'>
            <h3 className='reviewTitle'>Reviews:</h3>
            <ReviewList data={data.reviewData} />
        </Container>
    );
}


function Accommodation(props) {
    const location = useLocation();

    return (<>
        <Slideshow />
        {/* <ReadStarRating rate={location.state.data} /> */}
        <Details accomData={location.state.data} />
        <Review reviewData={location.state.data} />
    </>
    );
}

export default Accommodation;