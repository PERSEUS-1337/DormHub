import './accom-style.css';
import { Button, Row, Col, Carousel, Container, Spinner, Modal, Form } from 'react-bootstrap';
import React, { useState, useEffect } from "react";
import { ReadStarRating, StarRating, AccomStarRating } from '../components/StarRating';
import { useLocation } from 'react-router-dom';
import ReviewList from '../components/ReviewTile';

const Slideshow = (pics) => {
    // console.log(pics.pics.pics);
    const [modalShow, setModalShow] = React.useState(false);
    const [imgSrc, setImgSrc] = React.useState();

    function setupModal(src) {
        setModalShow(true);
        setImgSrc(src);
    }

    return (
        <>
            {pics.pics.length === 0 ? (
                <Carousel>
                    <Carousel.Item>
                        <img src="https://www.gpshealthonline.com/static/images/no-banner.jpg" alt="NO PIC" className="d-block" />
                    </Carousel.Item>
                </Carousel>
            ) : (
                <Carousel>
                    {pics.pics.map((src, index) => (
                        <Carousel.Item key={index} onClick={() => setupModal(src)}>
                            <img src={src} alt={`Picture ${index + 1}`} className="d-block" />
                        </Carousel.Item>
                    ))}
                </Carousel>
            )}


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
    // const type = localStorage.getItem("userType");
    const id = localStorage.getItem("_id");
    const jwt = localStorage.getItem("token");

    const [fetchedData, setFetchedData] = useState([]);
    const [containsValue, setContainsValue] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            fetch(`/api/v1/auth-required-func/bookmark/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`
                },
            })
                .then(res => res.json())
                .then(data => {
                    // console.log(data);
                    setFetchedData(data);
                    setIsLoading(false);
                })
        } catch (err) {
            console.log(err);
        }
    }, [id, jwt]);

    useEffect(() => {
        try {
            if (fetchedData.some(item => item._id === bId)) {
                setContainsValue(true);
            } else {
                setContainsValue(false);
            }
        } catch (err) {
            setContainsValue(false);
        }

        // console.log(containsValue);
    }, [fetchedData, bId, containsValue]);


    function addBookmark() {
        console.log(`Trying to add bookmark with id ${bId}`);
        setIsLoading(true);
        fetch(`/api/v1/auth-required-func/bookmark/${bId}/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
        })
            .then((response) => response.json())
            .then((body) => {
                console.log(body);
                window.location.reload();
            });
    };


    if (!isLoading && id && containsValue === false) {
        return (
            <div className="map" style={{ margin: '0px', padding: '0px' }}>
                <Button type="button" onClick={addBookmark}>Bookmark</Button>
            </div>
        );
    } else if (!isLoading && id && containsValue === true) {
        return (
            <p>Already Bookmarked.</p>
        );
    } else if (!isLoading) {
        return (
            <p>Please log-in to bookmark!</p>
        );
    } else {
        return (
            <Container className="d-flex align-items-center justify-content-center">
                <Spinner animation="border" role="status" size="lg">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        )
    }

}

const EditDetails = (data) => {
    const [isUserAccom, setIsUserAccom] = useState(false);

    const id = localStorage.getItem("_id");
    const jwt = localStorage.getItem("token");

    const [modalShow, setModalShow] = useState(false);


    try {
        fetch(`/api/v1/auth-required-func/accommodations/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
        })
            .then(res => res.json())
            .then(body => {
                for (var accom in body.accommodations) {
                    if (body.accommodations[accom]._id == data.data.accomData._id) {
                        setIsUserAccom(true);
                    }
                }
            })
    } catch (err) {
        // console.log(err);
        setIsUserAccom(false);
    }

    return (
        <>
            {
                isUserAccom ?
                    <>
                        <div className='editAccomButton'>
                            <Button type="button" className='btn editAccomButton' onClick={() => setModalShow(true)}>Edit Accommodation Description</Button>
                        </div>
                    </>

                    : <></>
            }
            <ModalEditDescription show={modalShow} onHide={() => setModalShow(false)} data={data} />
        </>
    );
}

function ModalEditDescription(props) {
    // console.log(props.data.data.accomData);

    // const [desc, setDesc] = useState(props.data.data.accomData.desc);
    var desc = props.data.data.accomData.desc;

    const handleSubmit = () => {

        const uId = localStorage.getItem("_id");
        const jwt = localStorage.getItem("token");

        desc = document.getElementById("comment").value;
        var update = { desc };

        console.log(desc);
        console.log(JSON.stringify(update));


        try {
            const res = fetch(`/api/v1/auth-required-func/accommodation/${props.data.data.accomData._id}/${uId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`
                },
                body: JSON.stringify(update),
            });
            const data = res.json();
            console.log(data);
            // if (res.status === 200) {
            //     // console.log(data.msg);
                window.location.reload();
                
            // }
        } catch (err) {
            console.error("Review POST error.", err);
        }
    };

function update(){
    // console.log(document.getElementById("comment").value);
    // setDesc(document.getElementById("comment").value);
    handleSubmit();
    props.onHide();
    window.location.reload();
}


    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <h4 className='modalDescTitle'>Edit Accommodation Description</h4>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <div class="form-group">
                        {/* <label for="comment">Edit Description:</label> */}
                        <textarea class="form-control" rows="5" id="comment">
                            {desc}
                        </textarea>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide} className='btn btn-danger'>Close</Button>
                <Button onClick={() => update()} className='btn btn-success text-white'>Save</Button>
            </Modal.Footer>
        </Modal>
    );
}


const Details = (data) => {
    // console.log(data.accomData)
    const reviewValues = data.accomData.review.map(review => review.rating);
    const total = reviewValues.reduce((accumulator, value) => accumulator + value, 0);

    const count = data.accomData.review.length
    const isLoggedIn = localStorage.getItem("_id") && localStorage.getItem("token");

    const id = localStorage.getItem("_id");
    const jwt = localStorage.getItem("token");

    const [isUser, setIsUser] = useState(true);

    if(isLoggedIn){
        try {
            fetch(`/api/v1/auth-required-func/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`
                },
            })
                .then(res => res.json())
                .then(body => {
                    // console.log(body.user.userType);
                    if (body.user.userType != 'User') {
                        setIsUser(false);
                        // console.log("Check");
                    }
                })
        } catch (err) {
            console.log(err);
        }
    }


    return (
        <Container className="desc_accom border-bottom pb-4">
            <h3 className='accomTitle'>{data.accomData.name}</h3>
            <Row className="accomRating">
                <Col className='' lg={1}>
                    <h5 className='ratingTitle'>Rating: </h5>
                </Col>
                <Col>
                    <AccomStarRating rate={Math.floor(total / count)} />
                </Col>
            </Row>

            <p id="accommDetail">{data.accomData.desc}</p>

            {
                isLoggedIn && !isUser ? <EditDetails data={data} /> : <></>
            }

            {/* <Button onClick={checkAccomIfMatched}>Test accom</Button> */}

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
                    <p>{data.accomData.location.vicinity}: {data.accomData.location.town}, {data.accomData.location.barangay}, {data.accomData.location.street}
                    </p>
                </Col>
                <Col sm={2}>
                    <AddToBookmarks bId={data.accomData._id} />
                </Col>
            </Row>
            <Row id="price" className="detail">
                <Col sm={1}>
                    <img src="../../assets/icons/price.jpg" alt="test2" />
                </Col>
                <Col sm={11}>
                    {
                        data.accomData.price.length === 1 ?
                            <p >Php {data.accomData.price[0]} per month</p>
                            :
                            <p >Php {data.accomData.price[0]} - Php {data.accomData.price[1]} per month</p>
                    }
                </Col>
            </Row>
            {/* <Row id="calendar" className="detail">
                <Col sm={1}>
                    <img src="../../assets/icons/calendar.jpg" alt="test3" />
                </Col>
                <Col sm={11}>
                    <p>Application Starts on July 2023</p>
                </Col>
            </Row> */}
        </Container>
    );
}


const CheckIfLoggedIn = ({ accommodationId }) => {
    const [rating, setRating] = useState("");
    const [detail, setDetail] = useState("");

    const handleRatingChange = (newRating) => {
        setRating(newRating)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const uId = localStorage.getItem("_id");
        const jwt = localStorage.getItem("token");

        const formData = { rating, detail };

        // const params = { id, uId };

        try {
            const res = await fetch(`/api/v1/auth-required-func/review/${accommodationId}/${uId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            console.log(data);
            if (res.status === 200) {
                console.log(data.msg);
                // closeModal();
            } else {
                console.log("error")
            }
        } catch (err) {
            console.error("Review POST error.", err);
        }
        window.location.reload();
    };
    return (
        <>
            <Container className='desc_accom reviewContainer mb-5'>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Row>
                            <Col lg={6} className='text-end'>
                                <Form.Label>
                                    <h5 className='mt-2'>Review Accommodation</h5>
                                </Form.Label>
                            </Col>
                            <Col lg={6} className=''>
                                <StarRating rating={rating} setRating={handleRatingChange} />
                            </Col>
                            {/* <Col lg={4}></Col> */}
                        </Row>

                        <Form.Control as="textarea" className='reviewInput' rows={3} type="text" value={detail} onChange={(e) => setDetail(e.target.value)} />
                    </Form.Group>
                    <div className='text-center'>
                        <Button className="fw-bold" variant="secondary" type="submit" >Submit Review</Button>
                    </div>
                </Form>
            </Container>
        </>
    );
}


const Review = (data) => {
    const isLoggedIn = localStorage.getItem("_id") && localStorage.getItem("token");

    return (
        <>
            <Container className='desc_accom reviewContainer'>
                <h4 className='reviewTitle'>Accommodation Reviews:</h4>
                {

                    data.reviewData.review.length > 0 ?
                        <ReviewList data={data.reviewData} />
                        :
                        <Container className='text-center mt-5'>
                            <h6>No Reviews Yet =(</h6>
                        </Container>


                },

                {isLoggedIn ? (
                    // console.log("id" + location.state.data._id),
                    <CheckIfLoggedIn accommodationId={data._id} />
                ) : (
                    <></>
                )}
            </Container>
        </>
    );
}

function Accommodation(props) {
    const location = useLocation();

    const id = location.state.data._id

    const [accomData, setAccomData] = useState(location.state.data);

    useEffect(() => {
        fetch(`/api/v1/accommodation/${id}`)
        .then(res =>res.json())
        .then(data => {
            setAccomData(data.accommodation);
        })
    }, []);

    // console.log(accomData);
    // console.log(location.state.data.pics);

    return (<>
        <Slideshow pics={location.state.data.pics}/>
        <Details accomData={accomData} />
        <Review reviewData={location.state.data} />
    </>
    );
}

export default Accommodation;