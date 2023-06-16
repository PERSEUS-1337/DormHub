import React, { useEffect, useState } from 'react'
import { Container, Col, Row, Form, Button, Alert, Spinner, Pagination, Dropdown, DropdownButton} from 'react-bootstrap';
import LodgingTileItem from './LodgingTileItem';

const SearchBar = ({ data }) => {
    const [filteredData, setFilteredData] = useState([])
    const [showSuggestions, setShowSuggestions] = useState([])
    const [wordEntered, setWordEntered] = useState("")
    const [show, setShow] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [showNoresults, setShowNoresults] = useState(false)
    const [alphaIndex, setAlphaIndex] = useState(0)
    const [alphaBtnText, setAlphaBtnIndex] = useState("A-Z")
    const [queryAlpha, setQueryAlpha] = useState('a-z')
    const [priceIndex, setPriceIndex] = useState(0)
    const [priceBtnText, setPriceBtnIndex] = useState("LOWEST PRICE")
    const [queryPrice, setQueryPrice] = useState('price-high')
    const [selectedType, setSelectedType] = useState('Type');
    const [queryType, setQueryType] = useState(null);
    const itemsPerPage = 3    
    const maxVisiblePages = 5
    const handleTypeSelection = (type) => {
        setSelectedType(type);
        switch (type) {
          case 'Apartment':
            setQueryType('apartment');
            break;
          case 'Condominium':
            setQueryType('condominium');
            break;
          case 'Dormitory':
            setQueryType('dormitory');
            break;
          case 'Transient':
            setQueryType('transient');
            break;
          case 'Hotel':
            setQueryType('hotel');
            break;
          case 'Hostel':
            setQueryType('hostel');
            break;
          case 'Bedspace':
            setQueryType('bedspace');
            break;
          default:
            setQueryType(null);
        }
        if (queryType) {
          handleSortType();
        }
      };

    useEffect(() => {
        let timeout
        if (showNoresults) {
            timeout = setTimeout(() => {
                setShowNoresults(false)
            }, 3000)
        }
    })

    useEffect(()=>{
        if (queryType) {
          handleSortType();
        }
      }, [queryType]);

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

    const renderPageNumbers = () => {
        const pageNumbers = []
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
        let endPage = Math.min(totalPages, startPage + maxVisiblePages -1)

        if (endPage - startPage < maxVisiblePages -1){
            startPage = Math.max(1, endPage - maxVisiblePages + 1)
        }

        for (let i = startPage; i <= endPage; i++){
            pageNumbers.push(
                <Pagination.Item
                    key={i}
                    active={i === currentPage}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </Pagination.Item>
            )
        }

        return pageNumbers;
    }

    const handleSearch = () => {
        
        const newFilter = data.filter((value) => {
                return value.name.toLowerCase().includes(wordEntered.toLowerCase())
        })
        if (wordEntered == "") {
            setFilteredData([])
        } else {
            setFilteredData(newFilter)
        }
        
        setCurrentPage(1)
        if (filteredData.length == 0) {
            setShowNoresults(true)
        } else {
            setShowNoresults(false)
        }
        

    }

    const handleSortAlpha = () => {
        if (alphaIndex === 1) {
            setQueryAlpha('a-z')
            setAlphaIndex(0)
            setAlphaBtnIndex('A-Z')
        } else {
            setQueryAlpha('z-a')
            setAlphaIndex(1)
            setAlphaBtnIndex('Z-A')
        }
        fetch(`/api/v1/accommodation/all?limit=100&sort=${queryAlpha}`)
      .then((res) => res.json())
      .then((data) => {
        setFilteredData(data.accommodations)
        setCurrentPage(1);
      })
      .catch((error) => {
        console.error('Error sorting accommodations:', error);
      });
    }

    const handleSortPrice = () => {
        if (priceIndex === 1) {
            setQueryPrice('price-high')
            setPriceIndex(0)
            setPriceBtnIndex('LOWEST PRICE')
        } else {
            setQueryPrice('price-low')
            setPriceIndex(1)
            setPriceBtnIndex('HIGEST PRICE')
        }
        fetch(`/api/v1/accommodation/all?limit=100&sort=${queryPrice}`)
      .then((res) => res.json())
      .then((data) => {
        setFilteredData(data.accommodations)
        setCurrentPage(1);
      })
      .catch((error) => {
        console.error('Error sorting accommodations:', error);
      });
    }


    const handleSortType = () => {
        if (queryType) {
            
            fetch(`/api/v1/accommodation/all?limit=100&type=${queryType}`)
                .then((res) => res.json())
                .then((data) => {
                    console.log(queryType, data);
                    setFilteredData(data.accommodations)
                    setCurrentPage(1);
                })
                .catch((error) => {
                    console.error('Error sorting accommodations:', error);
                    alert("Error sorting accommodations")
                    return;
                });
        }
        
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
                                <Col className='mx-4 mt-3'>
                                    <Form.Control type="search" placeholder="Search for an accommodation..." onChange={(e) => { setWordEntered(e.target.value); if (e.target.value == "") setFilteredData([]); }} onKeyUp={handleSuggestion} />
                                </Col>
                                <Col md="auto"><Button className="rounded-1 mx-2" variant="secondary" onClick={handleSearch}>Search</Button></Col>
                                <Col xs lg={2}><Button className="rounded-1 mx-2 text-nowrap" variant="secondary" onClick={handleViewAll}>View All</Button></Col>
                            </Form.Group>
                            
                        </Form>
                       
                    </Col>
        
                </Row>
                { filteredData.length == 0 && showNoresults && <h3 className='d-flex justify-content-center mt-5'>No Results Found.</h3> }
                {filteredData.length != 0 && (
                    <Container className='rounded-3' style={{ background: "#ffffff", marginTop: "5rem"}}>
                        <Row className='d-flex align-items-center ms-auto'>
                            <Col><h4>ACCOMMODATIONS: <span>{ filteredData.length }</span></h4></Col>
                            <Col className='d-flex justify-content-end'><Button variant='secondary' onClick={handleSortAlpha}>{alphaBtnText}</Button></Col>
                            <Col className='d-flex justify-content-end'><Button variant='secondary' onClick={handleSortPrice}>{priceBtnText}</Button></Col>
                            <Col className='d-flex justify-content-end'>
                                <Dropdown>
                                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                    {selectedType}
                                </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => handleTypeSelection('Apartment')}>Apartment</Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleTypeSelection('Condominium')}>Condominium</Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleTypeSelection('Dormitory')}>Dormitory</Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleTypeSelection('Transient')}>Transient</Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleTypeSelection('Hotel')}>Hotel</Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleTypeSelection('Hostel')}>Hostel</Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleTypeSelection('Bedspace')}>Bedspace</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
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
                            {renderPageNumbers()}             
                            <Pagination.Next onClick={handleNextPage} disabled={currentPage === totalPages} />
                            <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                        </Pagination>
                    </Container>
                )}
                
            </Container>
        )
    }

export default SearchBar