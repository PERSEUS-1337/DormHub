import { useState, useEffect } from "react";
import LodgingTileList from "../components/LodgingTileList";
import { Container, Col, Row, Image } from "react-bootstrap";
import FaveTileItem from "../components/FaveTileItem";

const ProfilePic = () => {
  return (
    <Image className="rounded-circle w-100 h-100" src="https://i.pinimg.com/222x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg" />
  );
}

const FaveTileList = () => {

  const [favData, setFavData] = useState({});
  const uid = localStorage.getItem("_id");
  const jwt = localStorage.getItem("token");
  
  useEffect(() => {
      fetch(`/api/v1/auth-required-func/user/bookmark/${uid}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization : `Bearer ${jwt}`
        },
      })
      .then(res =>res.json())
      .then(data => {
          setFavData(data);
          console.log(data);
      })
  }, []);

  const LodgingList = favData && favData.map(data => <FaveTileItem key={data.id} data={data} />)

  return (
      <>
          {LodgingList}
      </>
  )
}

const UserPage = () => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const uid = localStorage.getItem("_id");
      console.log(uid);
      const jwt = localStorage.getItem("token");
      console.log(jwt);

      try {
        const res = await fetch(`/api/v1/auth-required-func/user/${uid}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization : `Bearer ${jwt}`
          },
        });
        const data = await res.json();
        setUserData(data);
        } catch (err) {
          console.error('User fetching error.', err);
        }
      };
      fetchData();
    }, []); 


  const type = localStorage.getItem('userType');

  if (type === 'owner') {
    return (
      <>
        {/* When userType is owner, this component appears */}
        <Container className="mt-5 d-flex flex-column align-items-center">
          <Row>
            <Col xs={2}>
              <ProfilePic />
            </Col>
            <Col xs={7}>
              <h2>{`${userData.fname} ${userData.lname}`}</h2>
              {/* <h2> Juan Dela Cruz </h2> */}
              <h5 className="lead">From Manila, Philippines</h5>
              <h5 className="lead">Email: {`${userData.email}`}</h5>
              <h5 className="lead">Contact Number: 09950055973 </h5>
            </Col>
          </Row>
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
              <h2>{`${userData.fname} ${userData.lname}`}</h2>
              {/* <h2> Juan Dela Cruz </h2> */}
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