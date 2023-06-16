import './accom-style.css';
import { Button, Row, Col, Carousel, Container, Spinner, Modal, Form } from 'react-bootstrap';
import React, { useState, useEffect } from "react";
import { ReadStarRating, StarRating, AccomStarRating } from '../components/StarRating';
import { useLocation } from 'react-router-dom';
import ReviewList from '../components/ReviewTile';
import { useNavigate } from 'react-router-dom';

const Slideshow = (pics) => {

    const [modalShow, setModalShow] = React.useState(false);
    const [imgSrc, setImgSrc] = React.useState();

    function setupModal(src) {
        setModalShow(true);
        setImgSrc(src);
    }
    const no_image = process.env.PUBLIC_URL + '/no_image.png'
    return (
        <>
            {pics.pics.length === 0 ? (
                <Carousel>
                    <Carousel.Item>
                        <img src={no_image} alt="NO PIC" className="d-block" />
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
                // console.log(body);
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
                            <Button type="button" className='btn editAccomButton' onClick={() => setModalShow(true)}>Edit Accomodation Details</Button>
                        </div>
                    </>

                    : <></>
            }
            <ModalEditDescription show={modalShow} onHide={() => setModalShow(false)} data={data} />
        </>
    );
}

function ModalEditDescription(props) {

    var name = props.data.data.accomData.name;
    var desc = props.data.data.accomData.desc;
    var price = props.data.data.accomData.price;
    var location = props.data.data.accomData.location;
    var type = props.data.data.accomData.type;
    var amenity = props.data.data.accomData.amenity;

    // var isValidated = true;

    const handleSubmit = () => {

        const uId = localStorage.getItem("_id");
        const jwt = localStorage.getItem("token");

        name = document.getElementById("name").value;
        desc = document.getElementById("desc").value;
        price = document.getElementById("price1").value;
        location = {
            "vicinity": `${document.getElementById("vicinity").value}`,
            "street": `${document.getElementById("street").value}`,
            "barangay": `${document.getElementById("barangay").value}`,
            "town": `${document.getElementById("town").value}`,
        }
        type = document.getElementById("type").value;
        amenity = document.getElementById("amenity1").value;

        console.log(name);
        console.log(desc);
        console.log(price);
        console.log(location);
        console.log(type);
        console.log(amenity);

        var update = { name, price, desc, location, type, amenity };

        // console.log(desc);
        // console.log(JSON.stringify(update));


        try {
            const res = fetch(`/api/v1/auth-required-func/accommodation/${props.data.data.accomData._id}/${uId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`
                },
                body: JSON.stringify(update),
            });
            // const data = res.json();
            // console.log(data);
            // if (res.status === 200) {
            // console.log(data.msg);
            // window.location.reload();

            // }
        } catch (err) {
            console.error("Review POST error.", err);
        }
    };

    // const validateForm = () => {
    //     var isValidated = true;

    //     name = document.getElementById("name").value;
    //     desc = document.getElementById("desc").value;
    //     price = document.getElementById("price1").value;
    //     location = {
    //         "vicinity": `${document.getElementById("vicinity").value}`,
    //         "street": `${document.getElementById("street").value}`,
    //         "barangay": `${document.getElementById("barangay").value}`,
    //         "town": `${document.getElementById("town").value}`,
    //     }
    //     type = document.getElementById("type").value;
    //     amenity = document.getElementById("amenity1").value;

    //     var update = { name, desc, price, location, type, amenity };

    //     for (var item in update) {
    //         if (item = '') {
    //             isValidated = false;
    //             break;
    //         }
    //     }

    //     return isValidated;
    // }

    function update() {
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
                <Form>
                    <Form.Group>
                        <Form.Label>Accommodation Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Update Accommodation Name"
                            defaultValue={name}
                            id='name'
                        >
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Accommodation Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            type="text"
                            placeholder="Enter accommodation description"
                            defaultValue={desc}
                            rows={5}
                            id='desc'
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Price <span className="text-muted">/ Month </span>
                            (eg. 4500 or 3920 - 5450)</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter price"
                            // value={price}
                            defaultValue={price}
                            id="price1"
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Vicinity</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Vicinity"
                            defaultValue={location.vicinity}
                            id='vicinity'
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Street</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Street"
                            defaultValue={location.street}
                            id='street'
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Barangay</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Barangay"
                            defaultValue={location.barangay}
                            id='barangay'
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Town</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Town"
                            defaultValue={location.town}
                            id='town'
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Type</Form.Label>
                        <Form.Control
                            as="select"
                            defaultValue={type}
                            id='type'
                        >
                            <option value="" ></option>
                            <option value="apartment">Apartment</option>
                            <option value="condominium">Condominium</option>
                            <option value="dormitory">Dormitory</option>
                            <option value="transient">Transient</option>
                            <option value="hotel">Hotel</option>
                            <option value="hostel">Hostel</option>
                            <option value="bedspace">Bedspace</option>
                        </Form.Control>
                    </Form.Group>


                    <Form.Group>
                        <Form.Label>Amenity (eg. "Kitchen, Parking Lot, Wifi")</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter amenity"
                            defaultValue={amenity}
                            id='amenity1'
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide} className='btn btn-danger'>Cancel</Button>
                {/* {
                    validateForm() ?
                        <Button onClick={() => update()} className='btn btn-success text-white'>Update</Button>
                        :
                        <Button onClick={() => update()} className='btn btn-success text-white' disabled>Update</Button>

                } */}
                <Button onClick={() => update()} className='btn btn-success text-white'>Update</Button>


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

    if (isLoggedIn) {
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
            <h3 className='accomTitle'>{data.accomData.name}  <span className='badge bg-light'> {data.accomData.type}</span></h3>
            <Row className="accomRating">
                <Col className='' lg={1}>
                    <h5 className='ratingTitle'>Rating: </h5>
                </Col>
                <Col>
                    <AccomStarRating rate={Math.floor(total / count)} />
                </Col>
            </Row>

            <p id="accommDetail">{data.accomData.desc}</p>
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
            {
                isLoggedIn && !isUser ? <EditDetails data={data} /> : <></>
            }
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
    const navigate = useNavigate();
    const [rating, setRating] = useState("");
    const [detail, setDetail] = useState("");
    const [accomm, setAccomm] = useState("");

    const handleRatingChange = (newRating) => {
        setRating(newRating)
    }

    useEffect(() => {
        // console.log(accomm)
        if (accomm !== "") {
            // console.log("NAVIGATED")
            // console.log({ state: { data: accomm.accommodation } })
            navigate('/accommodation', { state: { data: accomm.accommodation } });
            window.location.reload();
        }
    }, [accomm]);

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
            // console.log(data.msg);

            fetch(`/api/v1/accommodation/${accommodationId}`)
                .then((res) => res.json())
                .then((data) => {
                    setAccomm(data);
                    console.log("DATA", data)
                });
            // closeModal();
        } catch (err) {
            console.error("Review POST error.", err);
        }
        // navigate('/accommodation', {state: {accomm}});
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
    const isLoggedIn = localStorage.getItem("_id") && localStorage.getItem("token")
    return (
        <>
            <Container className='desc_accom reviewContainer'>
                <h4 className='reviewTitle'>Accommodation Reviews:</h4>
                {

                    data.reviewData.review.length > 0 ?
                        <ReviewList data={data.reviewData} />
                        :
                        <Container className='text-center mt-5'>
                            <p className='font-italic'>No Reviews Yet</p>
                        </Container>


                },

                {isLoggedIn ? (
                    // console.log("id" + location.state.data._id),
                    <CheckIfLoggedIn accommodationId={data.reviewData._id} />
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
            .then(res => res.json())
            .then(data => {
                setAccomData(data.accommodation);
            })
    }, []);

    // console.log(accomData);
    // console.log(location.state.data.pics);

    return (<>
        <Slideshow pics={location.state.data.pics} />
        <Details accomData={accomData} />
        <Review reviewData={location.state.data} />
    </>
    );
}

export default Accommodation;