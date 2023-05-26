import { Container, Col, Row, Dropdown, DropdownButton, Form, Button, Card, Spinner } from 'react-bootstrap';
import './homepage-style.css';
import { Link, useNavigate } from 'react-router-dom';
import LodgingTileList from '../components/LodgingTileList';
import { useState, useEffect } from 'react';
import { StarRating } from '../components/StarRating';
import SearchBar from '../components/SearchBar';
import ScrollToTopButton from '../components/ScrollTopBtn';
//import Accommodation from './pages/accomodation';
//todo: include button in form

const AccomCards = () => {
    const navigate = useNavigate();

    const toAccomm = (data) => {
        navigate("/accommodation", {state: {data}})
    }

    const [isLoading, setIsLoading] = useState(true);
    const [accommData, setAccommData] = useState({});


    useEffect(() => {
        fetch("/api/v1/accommodation/all")
        .then(res =>res.json())
        .then(data => {
            setAccommData(data);
            setIsLoading(false);
            // console.log(data["accommodations"][2]);
        })
    }, []);
    
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
            {accommData.accommodations && accommData.accommodations.slice(0,3).map( data => (
                <Col key={data.id} className="col mx-auto">
                <Card className="bg-info" onClick={() => toAccomm(data)}>
                    {/* Added static src to test UI */}
                    <Card.Img variant="top" src="https://www.home-designing.com/wp-content/uploads/2016/02/luxury-gray-and-wood-bedroom.jpg" />
                <Card.Body>
                        <Card.Title>{data.name}</Card.Title>
                        {
                                data.price.length === 1? 
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


    useEffect(() => {
        fetch("/api/v1/accommodation/all")
        .then(res =>res.json())
        .then(data => {
            setAccommData(data);
            
            // console.log(data["accommodations"][2]);
        })
    }, []);
    
    return(
        <>
            <Container fluid className="background-container">

                <SearchBar data={ accommData.accommodations } />
             
            {/* commented the lines below this comment to test the search function */}
            {/* also moved the code to its own file for reusability in the future */}
        {/* <Container className="mt-5 ms-5" id="search-container2">
                <Row>
                    <Col xs={2} ></Col>
                    <Col xs={8} >
                        <Form>
                            <Form.Group className="sm-4" controlId="filterAccomms">
                                <Form.Control type="search" placeholder="Search for an accommodation..."/>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col xs={1} >
                        <Button type="submit" variant="dark" id = "searchbtn" className ="rounded-0" onClick={toggleVisible}>
                            Search
                        </Button>
                    </Col>
                    <Col xs={1}>
                        <Button type="submit" variant="dark" id = "searchbtn" className ="rounded-0 invisible">
                          Download PDF
                            
                        </Button>
                    </Col>
                </Row>
            </Container>
            <Container fluid className="ms-5 " id="search-container">
                <Row>
                    <Col xs={2}></Col>
                    <Col xs={1} ><p>Sort by</p></Col>
                    <Col xs={1}>
                        <Button type="submit" variant="dark" id = "searchbtn" className ="rounded-0">
                            Ranking
                        </Button>
                    </Col>
                    <Col xs={1}>
                        <DropdownButton
                            variant = "outline-secondary"
                            id = "search-dd-btn"
                            title = "Type"
                        >
                            <Dropdown.Item>Type 1</Dropdown.Item>
                            <Dropdown.Item>Type 2</Dropdown.Item>
                            <Dropdown.Item>Type 3</Dropdown.Item>
                        </DropdownButton>
                    </Col>

                    <Col xs={2}>
                        <StarRating />
                    </Col>
                    <Col xs={3} className="text-end">
                        <p className="invisible">1-50 of 137 accomodations</p> </Col>
                    <Col xs={2} className="text-end"> 
                        <Button  type="submit"  variant="white" className ="rounded-0 border border-dark  invisible">
                            <img src='https://cdn-icons-png.flaticon.com/512/109/109618.png' alt="star" className="d-block"/>
                        </Button>
                        <Button  type="submit"  variant="white" className = {isInvisible} >
                            <img src='https://cdn-icons-png.flaticon.com/512/109/109618.png' alt="star" className="d-block" id="rot"/>
                        </Button>
                    </Col>
                </Row>
            </Container> */}
        {/* <LodgingTileList /> */}

            <Container className = "mt-5 px-5">
                <h5>
                    TOP <span style={{ color: "#ffd041" }}>RECOMMENDATIONS</span>
                </h5>
            </Container>
            <Container className = "mt-4 pb-5 align-items-center">
                <AccomCards />
            </Container>
            <ScrollToTopButton />
        </Container>   
        </>

    );
}

export default HomePage;