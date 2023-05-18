import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Container, Card, Col, Row } from "react-bootstrap";

const AccomCards = () => {

  const [accommData, setAccommData] = useState({});

  
  useEffect(() => {
      fetch("/api/v1/accommodation")
      .then(res =>res.json())
      .then(data => {
          setAccommData(data);
          console.log(data["accommodations"][2]);
      })
  }, []);

  return (
    <Row xs={2} md={4} className="g-5">
      {accommData.accommodations && accommData.accommodations.map( data => (
          <Col key={data.id} className="col mx-auto">
          <Card>
          <Link to='/accommodation'>
              <Card.Img variant="top" src={ data.img_src } />
          </Link>
            <Card.Body>
                  <Card.Title>{data.name}</Card.Title>
                  {
                          data.price.length === 1? 
                          <Card.Text className="text-muted">PHP {data.price[0]}</Card.Text>
                          :
                          <Card.Text className="text-muted">PHP {data.price[0]} - {data.price[1]}</Card.Text>
                  }
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

const UserPage = () => {
  const [userData, setUserData] = useState({});

  /*
  Fix:
  Updated fetch
  Updated proxy with proxy overrideing (only a problem in development)
  MAKE SURE TO DELETE THE HARDCODED ID TO TEST FOR OTHER USERS
  */
  useEffect(() => {
    // fetch("/api/v1/auth/644b8da3b8d0cfef32d695a8")
    //   .then(res => res.json())
    //   .then(data => setUserData(data.user))
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem('uId');

        if (storedUser) {
          setUserData(JSON.parse(storedUser));

        } else {
          const response = await fetch ("/api/v1/auth/user/644b8da3b8d0cfef32d695a8");
          const data = await response.json();
          setUserData(data); 

          localStorage.setItem('userId', JSON.stringify(data));
        }

      } catch (error) {
        console.error('User fetching error.', error);

      }
    };

    fetchUser();

  }, []);
  const type = localStorage.getItem('userType');

  if (type === 'owner') {
    return (
      <>
        {/* You can change your implementation here, but this works for now, completely up to the frontend */}
        <Container className="mt-5 d-flex flex-column align-items-center">
        <div>
          <h3>{`${userData.fname} ${userData.lname}`}</h3>
          <p className="text-center">{`${userData.email}`}</p>
        </div>
        </Container>
        <Container>
          <h3>Accommodations:</h3>
          <AccomCards />
        </Container>
        
      </>
    );
  } else {
    return (
      <>
        {/* You can change your implementation here, but this works for now, completely up to the frontend */}
        <Container className="mt-5 d-flex flex-column align-items-center">
        <div>
          <h3>{`${userData.fname} ${userData.lname}`}</h3>
          <p className="text-center">@{`${userData.email}`}</p>
        </div>
        </Container>
        <Container>
          <h3>Favorites:</h3>
          <AccomCards />
        </Container>
        
      </>
    );
  }
  
};

export default UserPage;