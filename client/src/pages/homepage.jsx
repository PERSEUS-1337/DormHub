import { Container, Col, Row, Dropdown, DropdownButton, Form, Button, Card } from 'react-bootstrap';
import './homepage-style.css';
import { Link, useNavigate } from 'react-router-dom';
import LodgingTileList from '../components/LodgingTileList';
import { useState, useEffect } from 'react';
import { StarRating } from '../components/StarRating';
//import Accommodation from './pages/accomodation';
//todo: include button in form



const AccomCards = () => {
    // const temp_data = [
    //     {
    //         id: 1,
    //         name: "TENA'S RESIDENCES",
    //         img_src: "https://cdn.houseplansservices.com/product/tahbfmakhok6k787jtmjm3ecgt/w620x413.png?v=9",
    //         price: 3000
    //     },
    //     {
    //         id: 2,
    //         name: "DORMIFY",
    //         img_src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/315663049.jpg?k=bfa63b17927cc47fbeece382d0f520052eaefc592601ec7a9555685c01803949&o=&hp=1",
    //         price: 3500
    //     },
    //     {
    //         id: 3,
    //         name: "DWELLO",
    //         img_src: "https://media-cdn.tripadvisor.com/media/photo-s/0a/22/d6/51/peredo-s-loding-house.jpg",
    //         price: 7000
    //     }
    // ]

    const navigate = useNavigate();

    const toAccomm = (data) => {
        navigate("/accommodation", {state: {data}})
    }

    const [accommData, setAccommData] = useState({});


    useEffect(() => {
        fetch("/api/v1/accommodation")
        .then(res =>res.json())
        .then(data => {
            setAccommData(data);
            console.log(data["accommodations"][2]);
        })
    }, []);

    return (
      <Row xs={2} md={4} className="g-5">
        {accommData.accommodations && accommData.accommodations.map( data => (
            <Col key={data.id} className="col mx-auto">
            <Card onClick={() => toAccomm(data)}>
                <Card.Img variant="top" src={ data.img_src } />
              <Card.Body>
                    <Card.Title>{data.name}</Card.Title>
                    {
                            data.price.length ==1? 
                            <Card.Text className="text-muted">PHP {data.price[0]}</Card.Text>
                            :
                            <Card.Text className="text-muted">PHP {data.price[0]} - {data.price[1]}</Card.Text>
                    }
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    );
}

const HomePage = () => {
const [isInvisible, setIsInvisible] = useState("rounded-0 border border-dark invisible");
const toggleVisible = () => {
  setIsInvisible("rounded-0 border border-dark");
} 

    return(
        <>
        <Container className="mt-5 ms-5" id="search-container2">
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
            </Container>
        <LodgingTileList />

        <Container className = "recomms">
            <h5 className="header">
                TOP RECOMMENDATIONS
            </h5>
            <Container className = "recomm-list">
                <AccomCards />
            </Container>
        </Container>

        
            
        </>

    );
}

export default HomePage;