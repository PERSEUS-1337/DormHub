import React, { useState } from 'react'
import { Container, Col, Row, Form, Button, Alert} from 'react-bootstrap';
import LodgingTileItem from './LodgingTileItem';

const SearchBar = ({ data }) => {
    const [filteredData, setFilteredData] = useState([])
    const [wordEntered, setWordEntered] = useState("")
    const [show, setShow] = useState(false)

    const handleFilter = (e) => {
        try{

            const searchedWord = e.target.value
            setWordEntered(searchedWord)

            const newFilter = data.filter((value) => {
                return value.name.toLowerCase().includes(searchedWord.toLowerCase())
            })

            if (searchedWord === "") {
                setFilteredData([])
            } else {
                setFilteredData(newFilter)
            }


        }catch (error) {
            console.log(error)
            setShow(true)

        }
    }
    const clearInput = () => {
        setFilteredData([])
        setWordEntered("")
    }

    const dismissAlert = () => {
        setShow(false)
        clearInput()
    }

    const returnResults = () => {
        return (<>
            {
                filteredData.length != 0 && (
                    <Container className='rounded-3 mt-4' style={{background: "#ffffff"}}>
                        {filteredData.slice(0, 10).map((value, key) => {
                            return (
                                <LodgingTileItem key={value.id} data={value} />
                                // <p key={key._id}>{value.name}</p>
                           
                            )
                        })
                        }
                    </Container>
        )
        }
        </>)
    }

    if (show) {
        return (
            <Alert variant="danger" onClose={() => dismissAlert()} dismissible className='mt-3 mx-3' style={{caretColor: "transparent"}}>
                <Alert.Heading>Oh snap!</Alert.Heading>
                <p>
                    The system has malfunctioned and has notified the developers. Please wait a moment :)
                </p>
            </Alert>
        )
    }
        return (
            <Container className='mt-4'>
                <Row>
                    <Col lg={12} className='px-5'>
                        <Form>
                            <Form.Group controlId="filterAccomms"  className='d-flex align-items-center'>
                                <Form.Control type="search" placeholder="Search for an accommodation..." className='m-3' onChange={handleFilter} value={wordEntered} />
                                { /* <Button onClick={() => returnResults()} id="searchbtn" className ="rounded-1" variant="secondary">SEARCH</Button> */ }
                            </Form.Group>
                        </Form>
                    </Col>
        
                </Row>
                {/* <Row>
                    <Col lg={12} className='px-5'>
                        <span className='m-5'>Sort by</span>
                        
                    </Col>
                </Row> */}
                {/* Initial state of results when user inputs is the LodgingTileList, will change later */}
                {filteredData.length != 0 && (
                    <Container className='rounded-3 mt-4' style={{background: "#ffffff"}}>
                        {filteredData.slice(0, 10).map((value, key) => {
                            return (
                                <LodgingTileItem key={value.id} data={value} />
                                // <p key={key._id}>{value.name}</p>
                           
                            )
                        })
                        }
                    </Container>
                )}
            </Container>
        )
}

export default SearchBar