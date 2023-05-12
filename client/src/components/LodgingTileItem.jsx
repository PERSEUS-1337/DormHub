import React from 'react'
import { Container, Row, Col, Button, Image } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'

const LodgingTileItem = ({ data }) => {
    const navigate = useNavigate()

    const navigateToLodge = () => {
        navigate('/accommodation')
    }

    return (
        <Container className='border rounded mb-3'>
            <Row>
                <Col>
                    <Image className='img-thumbnail border-0' src={data.img_src} alt='Photo' rounded />
                </Col>
                <Col className='border'>
                    <h2 className='my-4'>{data.name}</h2>
                    <p>{data.rating} STARS</p>
                </Col>
                <Col>
                    <Row>
                        {
                            data.price.length ==1? 
                            <h3 className='my-4'>PHP {data.price[0]}</h3>
                            :
                            <h3 className='my-4'>PHP {data.price[0]} - {data.price[1]}</h3>
                        }
                        <div className="justify-content-end mt-2">
                            <Button onClick={navigateToLodge}>check</Button>
                        </div>
                    </Row>
                    
                </Col>
            </Row>
        </Container>
    )
}

export default LodgingTileItem