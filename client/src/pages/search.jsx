import { Container, Col, Row, Dropdown, DropdownButton, Form, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './homepage-style.css';

const Search = () => {
    return (
        <>
            <Container fluid className="mt-5 ms-5" id="search-container2">
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
                        <Button type="submit" variant="dark" id = "searchbtn" className ="rounded-0">
                            Search
                        </Button>
                    </Col>
                    <Col xs={1} >
                        <Button type="submit" variant="dark" id = "searchbtn" className ="rounded-0">
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
                        <div id="ratings">
                            <img src='https://cdn-icons-png.flaticon.com/512/541/541415.png' alt="star" className="d-block"/>
                            <img src='https://cdn-icons-png.flaticon.com/512/541/541415.png' alt="star" className="d-block"/>
                            <img src='https://cdn-icons-png.flaticon.com/512/541/541415.png' alt="star" className="d-block"/>
                            <img src='https://cdn-icons-png.flaticon.com/512/541/541415.png' alt="star" className="d-block"/>
                            <img src='https://cdn-icons-png.flaticon.com/512/541/541415.png' alt="star" className="d-block"/>
                        </div>
                    </Col>
                    <Col xs={3} className="text-end">
                        <p>1-50 of 137 accomodations</p> </Col>
                    <Col xs={2} className="text-end"> 
                        <Button  type="submit"  variant="white" className ="rounded-0 border border-dark">
                            <img src='https://cdn-icons-png.flaticon.com/512/109/109618.png' alt="star" className="d-block"/>
                        </Button>
                        <Button  type="submit"  variant="white" className ="rounded-0 border border-dark">
                            <img src='https://cdn-icons-png.flaticon.com/512/109/109618.png' alt="star" className="d-block" id="rot"/>
                        </Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Search;