import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Image } from 'react-bootstrap'
import { FaArrowRight, FaHeart } from 'react-icons/fa'
import { useNavigate, Link } from 'react-router-dom'

const LodgingTileItem = ({ data }) => {
    // const [isBookmarked, setIsBookmarked] = useState(false);
    const [isArchived, setIsArchived] = useState('');
    const navigate = useNavigate();

    const navigateToLodge = (data) => {
        navigate('/accommodation', {state: {data}})
    }
    
    useEffect(() => {
        if (data.archived) {
            setIsArchived('border rounded mb-3 bg-info');
        } else {
            setIsArchived('border rounded mb-3');
        }
    }, [data]);

    console.log("LODGING TILE ITEM", data.pics[0])
    

    return (
        <Container className={isArchived}>
            <Row>
                <Col>
                    {data.pics.length === 0 ? (
                        <Image className='img-thumbnail border-0' src="https://www.gpshealthonline.com/static/images/no-banner.jpg" alt='Lodge Photo' rounded />
                    ) : (
                        <Image className='img-thumbnail border-0' src={data.pics[0]} alt='Lodge Photo' rounded />
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
                    
                    {
                        data.rating > 1 ?
                            <p><b><span className='h4'>{data.rating}</span></b> STARS</p>
                            :
                            <p><b><span className='h4'>{data.rating}</span></b> STAR</p>
                    }
                    
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
                            {/* <FaHeart
                                size={35}
                                onClick={() => setIsBookmarked(!isBookmarked)}
                                color={isBookmarked ? "#8b0000" : "#b8bac2"}
                                style={{ cursor: 'pointer' }}
                            /> */}
                        </Col>

                        <div className="d-flex justify-content-center">
                            <Button onClick={() => navigateToLodge(data)} className='mb-4'>View Details   <FaArrowRight /></Button>
                        </div>
                    </Row>
                    
                </Col>
              
            </Row>
        </Container>
    )
}

export default LodgingTileItem