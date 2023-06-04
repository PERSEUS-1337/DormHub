import React from 'react'
import { Container, Row, Col, Button, Image } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

// When functional, add a button for delete
const DeleteBookmark = () => {
    fetch('api/v1/auth/bookmark/:id/:uId', { // api endpoint to be modified
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } 
        throw response;
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
      });
};

const FaveTileItem = ({ data }) => {
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
                    <Row className="bg-info">
                        {
                            data.price.length === 1? 
                            <h3 className='my-4'>PHP {data.price[0]}</h3>
                            :
                            <h3 className='my-4'>PHP {data.price[0]} - {data.price[1]}</h3>
                        }
                        <div className="justify-content-end mt-2">
                            <Button variant="secondary" onClick={() => navigateToLodge(data)} className='mb-5'>Check</Button>
                        </div>
                    </Row>
                    
                </Col>
            </Row>
        </Container>
    )
}

export default FaveTileItem