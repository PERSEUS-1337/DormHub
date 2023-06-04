import React, { useState } from 'react'
import { Container, Row, Col, Button, Image } from 'react-bootstrap'
import { FaHeart } from 'react-icons/fa'
import { useNavigate, Link } from 'react-router-dom'

const LodgingTileItem = ({ data }) => {
    const [isBookmarked, setIsBookmarked] = useState(false)
    const navigate = useNavigate()

    const navigateToLodge = (data) => {
        navigate('/accommodation', {state: {data}})
    }

    return (
        <Container className='border rounded mb-3'>
            <Row>
                <Col>
                    <Image className='img-thumbnail border-0' src={data.img_src} alt='Lodge Photo' rounded />
                </Col>
                <Col className='border'>
                    <h2 className='my-4'>{data.name}</h2>
                    <p>{data.rating} STARS</p>
                </Col>
                <Col>
                    <Row>
                        <Col className='d-flex align-items-center'>
                            {
                                data.price.length ==1? 
                                <h3 className='my-4'>PHP {data.price[0]}</h3>
                                :
                                <h3 className='my-4'>PHP {data.price[0]} - {data.price[1]}</h3>
                            }
                            <FaHeart
                                size={35}
                                onClick={() => setIsBookmarked(!isBookmarked)}
                                color={isBookmarked ? "#8b0000" : "#b8bac2"}
                                style={{ cursor: 'pointer' }}
                            />
                        </Col>

                        <div className="d-flex justify-content-center">
                            <Button onClick={() => navigateToLodge(data)} className='mb-4'>check</Button>
                        </div>
                    </Row>
                    
                </Col>
              
            </Row>
        </Container>
    )
}

export default LodgingTileItem