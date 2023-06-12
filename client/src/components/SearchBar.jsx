import React, { useState } from 'react'
import { Container, Col, Row, Form, Button, Alert, Spinner, Pagination} from 'react-bootstrap';
import LodgingTileItem from './LodgingTileItem';

const SearchBar = ({ data }) => {
    const [isLoading, setIsLoading] = useState(data);
    const [filteredData, setFilteredData] = useState([])
    const [showSuggestions, setShowSuggestions] = useState([])
    const [wordEntered, setWordEntered] = useState("")
    const [show, setShow] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 3

    const clearInput = () => {
        setFilteredData([])
        setWordEntered("")
    }

    const dismissAlert = () => {
        setShow(false)
        clearInput()
    }
    
    const handleViewAll = () => {
        setFilteredData(data)
        setCurrentPage(1)
    }

    const indexLastItem = currentPage * itemsPerPage
    const indexFirstItem = indexLastItem - itemsPerPage
    const currentItems = filteredData.slice(indexFirstItem, indexLastItem)

    const totalPages = Math.ceil(filteredData.length / itemsPerPage)
    
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const handleSearch = () => {
        
        const newFilter = data.filter((value) => {
                return value.name.toLowerCase().startsWith(wordEntered.toLowerCase())
        })
        if (wordEntered == "") {
            setFilteredData([])
        } else {
            setFilteredData(newFilter)
        }
        
        setCurrentPage(1)

    }

    const handleSuggestion = () => {
        const newFilter = data.filter((value) => {
                return value.name.toLowerCase().startsWith(wordEntered.toLowerCase())
        })
        if (wordEntered == "") {
            setShowSuggestions([])
        } else {
            setShowSuggestions(newFilter)
        }
    }
    
        if (show) {
            return (
                <Alert variant="danger" onClose={() => dismissAlert()} dismissible className='mt-3 mx-3' style={{ caretColor: "transparent" }}>
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
                    <Col className='px-5'>
                        <Form onSubmit={(e) => { e.preventDefault(); handleSearch(e);}}>
                            <Form.Group controlId="filterAccomms" className='d-flex align-items-center mx-2'>
                                <Col className='mx-4'>
                                    <Form.Control type="search" placeholder="Search for an accommodation..." onChange={(e) => { setWordEntered(e.target.value); if (e.target.value == "") setFilteredData([]); }} onKeyUp={handleSuggestion} />
                                    <Container style={{ background: "red", marginTop: "-1.3rem", marginLeft: "2rem", maxWidth: "60.5rem"}}>
                                        {showSuggestions.length != 0 && filteredData.length == 0 && (
                                            <Row>
                                                {showSuggestions.slice(0, 10).map((value) => {
                                                    console.log(value)
                                                    return (
                                                        <p>{ value.name }</p>
                                                    )
                                                })}
                                            </Row>
                                        )}
                                    </Container>
                                </Col>
                                <Col md="auto"><Button className="rounded-1 mx-2" variant="secondary" onClick={handleSearch}>Search</Button></Col>
                                <Col xs lg={2}><Button className="rounded-1 mx-2 text-nowrap" variant="secondary" onClick={handleViewAll}>View All</Button></Col>
                            </Form.Group>
                            
                        </Form>
                       
                    </Col>
        
                </Row>
                {filteredData.length != 0 && (
                    <Container className='rounded-3 mt-5' style={{ background: "#ffffff" }}>
                        <Row className='d-flex align-items-center ms-auto'>
                            <Col><h4>ACCOMMODATIONS: </h4></Col>
                            <Col className='d-flex justify-content-end'><Button variant='secondary'>Generate PDF</Button></Col>
                        </Row>
                        
                        <br />
                        {currentItems.map((value, key) => {
                            return (
                                <LodgingTileItem key={key} data={value} />
                           
                            )
                        })
                        }
                        <Pagination className='d-flex justify-content-center'>
                            <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                            <Pagination.Prev onClick={handlePreviousPage} disabled={currentPage === 1} />


                           

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                                <Pagination.Item
                                    key={pageNumber}
                                    active={pageNumber === currentPage}
                                    onClick={() => handlePageChange(pageNumber)}
                                >
                                    {pageNumber}
                                </Pagination.Item>
                            ))}

                                
                            
                            
                            <Pagination.Next onClick={handleNextPage} disabled={currentPage === totalPages} />
                            <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                        </Pagination>
                    </Container>
                )}
                
            </Container>
        )
    }

export default SearchBar