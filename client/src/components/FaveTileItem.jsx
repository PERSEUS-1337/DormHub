import React from 'react'
import { Container, Row, Col, Button, Image } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const FaveTileItem = ({ data }) => {
    const navigate = useNavigate()

    const bId = data._id;

    function DeleteBookmark() {
            const type = localStorage.getItem('userType');
            const id = localStorage.getItem('_id');
            const jwt = localStorage.getItem('token');
        
            fetch(`api/v1/auth-required-func/${type}/bookmark/${bId}/${id}`, { // api endpoint to be modified
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwt}`,
              },
            })
            .then(res =>res.json())
            console.log('successful deletion');

            window.location.reload();
    }

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
                    <Row className="bg-info">
                        {
                            data.price.length === 1? 
                            <h3 className='my-4'>PHP {data.price[0]}</h3>
                            :
                            <h3 className='my-4'>PHP {data.price[0]} - {data.price[1]}</h3>
                        }
                        <Col>
                            <div className="justify-content-end ms-auto">
                                <Button variant="secondary" onClick={() => navigateToLodge(data)} className='mb-5'>Check</Button>
                            </div>
                        </Col>
                        <Col>
                            <div className="justify-content-end ms-auto">
                                <Button variant="light" onClick={DeleteBookmark} className='mb-5'>Remove</Button>
                            </div>
                        </Col>
                    </Row>
                    
                </Col>
            </Row>
        </Container>
    )
}

export default FaveTileItem