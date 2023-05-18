import { useState, useEffect } from "react";
import FaveTileList from '../components/FaveTileList';
import LodgingTileList from "../components/LodgingTileList";
import { Container, Col, Row, Image } from "react-bootstrap";

const ProfilePic = () => {
  return (
    <Image className="rounded-circle w-100 h-100" src="https://i.pinimg.com/222x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg" />
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
    fetch("/api/v1/auth/644b8da3b8d0cfef32d695a8")
      .then(res => res.json())
      .then(data => setUserData(data.user))
      .catch(error => {
        console.error('User fetching error.', error);
      }) 

  }, []);

  const type = localStorage.getItem('userType');

  if (type === 'owner') {
    return (
      <>
        {/* When userType is owner, this component appears */}
        <Container className="mt-5 d-flex flex-column align-items-center">
          <div>
            <h3> {`${userData.fname} ${userData.lname}`}</h3>
            <p className="text-center text-muted">@{`${userData.email}`}</p>
          </div>
        </Container>
        <Container>
          <h3>Accommodations:</h3>
          <LodgingTileList />
        </Container>
        
      </>
    );
  } else {
    return (
      <>
      {/* When userType is not owner, i.e. user, this component appears */}
        <Container className="mt-5 mb-3 pb-4 d-flex flex-column align-items-left border-bottom">
          <Row>
            <Col xs={2}>
              <ProfilePic />
            </Col>
            <Col xs={7}>
              {/* <h3>{`${userData.fname} ${userData.lname}`}</h3> */}
              <h2> Juan Dela Cruz </h2>
              <h5 className="lead">From Manila, Philippines</h5>
              <h5 className="lead">Email: {`${userData.email}`}</h5>
              <h5 className="lead">Contact Number: 09950055973 </h5>
            </Col>
          </Row>
        </Container>
        <Container>
          <h4>Favorites:</h4>
          <FaveTileList />
        </Container>
        
      </>
    );
  }
  
};

export default UserPage;