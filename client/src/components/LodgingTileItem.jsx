import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Image } from 'react-bootstrap'
import { FaArrowRight, FaHeart } from 'react-icons/fa'
import { useNavigate, Link } from 'react-router-dom'

const LodgingTileItem = ({ data }) => {
    // const [isBookmarked, setIsBookmarked] = useState(false);
    const [isArchived, setIsArchived] = useState('');
    const navigate = useNavigate();

    const navigateToLodge = (data) => {
        console.log("NAVIGATE TO LODGE DATA", data)
        navigate('/accommodation', {state: {data}})
    }
    
    useEffect(() => {
        if (data.archived) {
            setIsArchived('border rounded mb-3 bg-info');
        } else {
            setIsArchived('border rounded mb-3');
        }
    }, [data]);
    const no_image = process.env.PUBLIC_URL + '/no_image.png'
    return (
        <Container className={isArchived}>
            <Row >
                <Col className='d-flex justify-content-center'>
                    {data.pics.length === 0 ? (
                        <Image style={{ objectFit: "cover", height: "200px", width: "400px", overflow: "hidden"}} className='img-fluid border-0' src={no_image} alt='Lodge Photo' rounded />
                    ) : (
                        <Image style={{ objectFit: "cover", height: "200px", width: "400px", overflow: "hidden"}} className='img-fluid border-0' src={data.pics[0]} alt='Lodge Photo' rounded />
                    )}
                    
                </Col>
                <Col className='border'>
                    {
                        data.archived ? (
                            <h2 className='my-4'>{data.name} (archived)</h2>
                        ) : (
                            <h2 className='my-4'>{data.name}</h2>
                        )
                    }
                       
                </Col>
                <Col>
                    <Row>
                        <Col className='d-flex align-items-center'>
                            {
                                data.price.length ==1? 
                                <h3 className='my-4'>PHP {data.price[0]}</h3>
                                :
                                data.price[0] > data.price[1] ?
                                <h3 className='my-4'>PHP {data.price[1]} - {data.price[0]}</h3>
                                :
                                <h3 className='my-4'>PHP {data.price[0]} - {data.price[1]}</h3>
                            }
                        </Col>

                        <div className="d-flex justify-content-center">
                            {data.archived ? (<></>) : (<Button onClick={() => navigateToLodge(data)} className='mb-4'>View Details   <FaArrowRight /></Button>)}
                            
                        </div>
                    </Row>
                    
                </Col>
              
            </Row>
        </Container>
    )
}

export default LodgingTileItem