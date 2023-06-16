import { Container, Col, Row, Dropdown, DropdownButton, Form, Button, Card, Spinner } from 'react-bootstrap';
import './homepage-style.css';
import { Link, useNavigate } from 'react-router-dom';
import LodgingTileList from '../components/LodgingTileList';
import { useState, useEffect } from 'react';
import { StarRating } from '../components/StarRating';
import SearchBar from '../components/SearchBar';
import ScrollToTopButton from '../components/ScrollTopBtn';


const AccomCards = () => {
    const navigate = useNavigate();

    const toAccomm = (data) => {
        navigate("/accommodation", { state: { data } })
    }

    const [isLoading, setIsLoading] = useState(true);
    const [accommData, setAccommData] = useState({});


    useEffect(() => {
        fetch("/api/v1/accommodation/all?limit=100")
            .then((res) => res.json())
            .then((data) => {
                setAccommData(data);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        if (accommData.accommodations) {
            const topThreeAccommodations = accommData.accommodations
                .map((accommodation) => {
                    const reviewValues = accommodation.review.map((data) => data.rating);
                    const total = reviewValues.reduce((accumulator, value) => accumulator + value, 0);
                    const averageRating = total / reviewValues.length;

                    return { accommodation, averageRating };
                })
                .sort((a, b) => b.averageRating - a.averageRating)
                .slice(0, 3)
                .map((item) => item.accommodation);

            console.log(topThreeAccommodations);
        }
    }, [accommData]);

    const topThreeAccommodations = accommData.accommodations && accommData.accommodations
        .map(accommodation => {
            const reviewValues = accommodation.review.map(data => data.rating);
            const total = reviewValues.reduce((accumulator, value) => accumulator + value, 0);
            const averageRating = total / reviewValues.length;

            return { accommodation, averageRating };
        })
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 3)
        .map(item => item.accommodation);

    console.log(topThreeAccommodations);
    const no_image = process.env.PUBLIC_URL + '/no_image.png'
    return (
        <>
            {isLoading ? (
                <Container className="d-flex align-items-top justify-content-center vh-100">
                    <Spinner animation="border" role="status" size="lg">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Container>
            ) : (
                <Row md={4} className="g-3 row mx-auto">
                    {/* BACKLOG: Retrieve highest rating top 3 accommodations */}
                    {topThreeAccommodations.map(data => (
                        // console.log(data._id),
                        <Col key={data._id} className="col mx-auto" style={{ cursor: "pointer" }}>
                            <Card className="bg-info" onClick={() => toAccomm(data)}>
                                {/* Added static src to test UI */}
                                {data.pics.length === 0 ? (
                                    <Card.Img variant="top" src={no_image} alt="NO AVAILABLE PICTURE" style={{ objectFit: "cover", height: "150px", width: "auto", overflow: "hidden" }} />
                                ) : (
                                    <Card.Img variant="top" src={data.pics[0]} alt="NO AVAILABLE PICTURE" style={{ objectFit: "cover", height: "150px", width: "auto", overflow: "hidden" }} />
                                )}

                                <Card.Body>
                                    <Card.Title>{data.name}</Card.Title>
                                    {
                                        data.price.length === 1 ?
                                            <Card.Text className="text-muted">PHP {data.price[0]} / month</Card.Text>
                                            :
                                            <Card.Text className="text-muted">PHP {data.price[0]} - {data.price[1]} / month</Card.Text>
                                    }
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

        </>
    );
}

const HomePage = () => {
    const [isInvisible, setIsInvisible] = useState("rounded-0 border border-dark invisible");
    const toggleVisible = () => {
        setIsInvisible("rounded-0 border border-dark");
    }

    const [accommData, setAccommData] = useState({});
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        fetch("/api/v1/accommodation/all?limit=100")
            .then(res => res.json())
            .then(data => {
                setAccommData(data);
                setIsLoading(false);
                // console.log(data);
                // console.log(data["accommodations"][2]);
            })
    }, []);

    return (
        <>
            <Container fuild className="art-container"></Container>
            <Container fluid className="background-container">

                {
                    isLoading ?
                        <Container className="d-flex align-items-top justify-content-center vh-100">
                            <Spinner animation="border" role="status" size="lg">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </Container>
                        :
                        <SearchBar data={accommData.accommodations} />
                }

                <Container className="mt-5 px-5">
                    <div className="spacer"></div>
                    <h5>
                        TOP <span style={{ color: "#ffd041" }}>RECOMMENDATIONS</span>
                    </h5>
                </Container>
                <Container className="mt-4 pb-5 align-items-center">
                    <AccomCards />
                </Container>
                <ScrollToTopButton />
            </Container>
        </>

    );
}
export default HomePage;