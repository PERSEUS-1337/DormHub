import { React, useState } from 'react'
import { Container, Row, Col, Button, Image, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { ReadStarRating, StarRating, AccomStarRating } from '../components/StarRating';


const FaveTileItem = ({ data }) => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const bId = data._id;

    function ReloadComponent() {
        window.location.reload();
    }
 
    function DeleteBookmark() {
        setIsLoading(true);
        const type = localStorage.getItem('userType');
        const id = localStorage.getItem('_id');
            const jwt = localStorage.getItem('token');
        
            fetch(`api/v1/auth-required-func/bookmark/${bId}/${id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwt}`,
              },
            })
            .then(res =>res.json())
            .then((body) => {
                console.log(body);

                if(!body.error) {
                    ReloadComponent();
                    setIsLoading(false);
                }
            })
    }

    const navigateToLodge = (data) => {
        navigate('/accommodation', {state: {data}})
    }

    const reviewValues = data.review.map(review => review.rating);
    const total = reviewValues.reduce((accumulator, value) => accumulator + value, 0);
    // console.log(total, reviewValues.length)
    const no_image = process.env.PUBLIC_URL + '/no_image.png'
    return (
        <Container className='border rounded mb-3'>
            <Row>
                <Col>
                    {data.pics.length === 0 ? (
                            <Image style={{ objectFit: "cover", height: "200px", width: "400px", overflow: "hidden"}} className='img-fluid border-0' src={no_image} alt='Lodge Photo' rounded />
                        ) : (
                            <Image style={{ objectFit: "cover", height: "200px", width: "400px", overflow: "hidden"}} className='img-fluid border-0' src={data.pics[0]} alt='Lodge Photo' rounded />
                    )}
                </Col>
                <Col className='border'>
                    <h2 className='my-4'>{data.name}</h2>
                    <AccomStarRating rate={Math.floor(total / reviewValues.length)} />
                </Col>
                <Col>
                    <Row className="bg-info">
                        {
                            data.price.length === 1? 
                            <h3 className='my-4'>PHP {data.price[0]}</h3>
                            :
                            data.price[0] > data.price[1] ?
                            <h3 className='my-4'>PHP {data.price[1]} - {data.price[0]}</h3>
                            :
                            <h3 className='my-4'>PHP {data.price[0]} - {data.price[1]}</h3>
                        }
                        <Col>
                            <div className="justify-content-end ms-auto">
                                <Button variant="secondary" onClick={() => navigateToLodge(data)} className='mb-5'>Check</Button>
                            </div>
                        </Col>
                        <Col>
                            {
                                isLoading ? (
                                    <div className="d-flex justify-content-center align-items-center">
                                        <Spinner animation="border" variant="primary" role="status" size="lg">
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>
                                    </div>
                                ) : (
                                    <div className="justify-content-end ms-auto">
                                        <Button variant="light" onClick={DeleteBookmark} className='mb-5'>Remove</Button>
                                    </div>
                                )
                            }
                            
                        </Col>
                    </Row>
                    
                </Col>
            </Row>
        </Container>
    )
}

export default FaveTileItem