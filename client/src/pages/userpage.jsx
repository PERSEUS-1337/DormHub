import { useState, useEffect } from "react";
import { Container, Col, Row, Image } from "react-bootstrap";
import FaveTileItem from "../components/FaveTileItem";

const ProfilePic = () => {
  return (
    <Image className="rounded-circle w-100 h-100" src="https://i.pinimg.com/222x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg" />
  );
}

const AccommTileList = () => {
  const [accommData, setAccommData] = useState(null);

  useEffect(() => {
    const fetchAccomms = async () => {
      const oid = localStorage.getItem("_id");
      console.log(oid);
      const jwt = localStorage.getItem("token");
      console.log(jwt);

      try {
        const res = await fetch(`/api/v1/auth-required-func/owner/accommodation/${oid}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization : `Bearer ${jwt}`
          },
        });
        const owned = await res.json();
        setAccommData(owned.accommodations);
        } catch (err) {
          console.error('Bookmark fetching error.', err);
        }
      };
      fetchAccomms();
    }, []); 

    console.log(accommData);
    const LodgingList = accommData && accommData.map(data => <FaveTileItem key={data.id} data={data} />)

  return (
      <> 
          {LodgingList}
      </>
  )
}

const FaveTileList = () => {

  const [favData, setFavData] = useState(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      const uid = localStorage.getItem("_id");
      console.log(uid);
      const jwt = localStorage.getItem("token");
      console.log(jwt);

      try {
        const res = await fetch(`/api/v1/auth-required-func/user/bookmark/${uid}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization : `Bearer ${jwt}`
          },
        });
        const faves = await res.json();
        setFavData(faves);
        } catch (err) {
          console.error('Bookmark fetching error.', err);
        }
      };
      fetchBookmarks();
    }, []); 

    console.log(favData);
    const LodgingList = favData && favData.map(data => <FaveTileItem key={data.id} data={data} />)

  return (
      <> 
          {LodgingList}
      </>
  )
}

const CheckUserType = () => {
  const userType = localStorage.getItem("userType");

  if (userType === "owner") {
    return (
      <>
      <h3>Accommodations:</h3>
      <AccommTileList />
      </>
    );
  } else if (userType === "user") {
    return (
      <>
      <h3>Favorites:</h3>
      <FaveTileList />
      </>
    );
  }
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
        const res = await fetch(`/api/v1/auth-required-func/${localStorage.getItem("userType")}/${uid}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization : `Bearer ${jwt}`
          },
        });
        const data = await res.json();
        setUserData(data);
        console.log(data);
        } catch (err) {
          console.error('User fetching error.', err);
        }
      };
      fetchData();
    }, []); 

    return (
      <>
        {/* When userType is owner, this component appears */}
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
          <CheckUserType />
        </Container>
        
      </>
    );
  
};

export default UserPage;