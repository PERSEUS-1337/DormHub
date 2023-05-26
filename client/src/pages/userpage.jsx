import { useState, useEffect } from "react";
import { Container, Col, Row, Image, Spinner } from "react-bootstrap";
import FaveTileItem from "../components/FaveTileItem";
import EditUserProfile from "../components/EditUser";
import { useNavigate } from "react-router-dom";

const ProfilePic = () => {
  return (
    <Image className="rounded-circle w-100 h-100" src="https://i.pinimg.com/222x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg" />
  );
}

const AccommTileList = () => {
  const [accommData, setAccommData] = useState(null);
  const [hasAccomm, setHasAccomm] = useState(true);

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
        if (owned.error) {
          setHasAccomm(false);
        }
        } catch (err) {
          console.error('Bookmark fetching error.', err);
        }
      };
      fetchAccomms();
    }, []); 

    if (hasAccomm === false) {
      return(
        <p>No Accommodations Uploaded Yet.</p>
      )
    } else {
      const LodgingList = accommData && accommData.map(data => <FaveTileItem key={data._id} data={data} />)
      return (
        <>
          {LodgingList}
        </>
      )
    }
}

const FaveTileList = () => {

  const [favData, setFavData] = useState(null);
  const [hasFav, setHasFav] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      const type = localStorage.getItem("userType");
      const uid = localStorage.getItem("_id");
      const jwt = localStorage.getItem("token");

      try {
        const res = await fetch(`/api/v1/auth-required-func/${type}/bookmark/${uid}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization : `Bearer ${jwt}`
          },
        });
        const faves = await res.json();
        setFavData(faves);
        if (faves.error) {
          setHasFav(false);
        }
        } catch (err) {
          console.error('Bookmark fetching error.', err);
        }
      };
      fetchBookmarks();
    }, []);

    

    if (hasFav === false) {
      return(
        <p>No Favorites Yet.</p>
      )
    } else {
      const BkmarkList = favData && favData.map(data => <FaveTileItem key={data.id} data={data} />)
      return (
        <>
          {BkmarkList}
        </>
      )
    }
  
}

const CheckIfOwner = () => {
  const userType = localStorage.getItem("userType");

  if (userType === "owner") {
    return (
      <>
      <h3>Accommodations:</h3>
      <AccommTileList />
      </>
    );
  }
}

const Details = ({ data }) => {
  return (
    <>
        <Container className="mt-5 mb-3 pb-4 d-flex flex-column align-items-left border-bottom">
          <Row> 
            <Col xs={2}>
              <ProfilePic />
            </Col>
            <Col xs={7}>
              <h2>{`${data.fname} ${data.lname}`}</h2>
              <h5 className="lead">From Manila, Philippines</h5>
              <h5 className="lead">Email: {`${data.email}`}</h5>
              <h5 className="lead">Contact Number: 09950055973 </h5>
            </Col>
            <Col xs={3} className ="d-flex justify-content-end align-items-start">
              <EditUserProfile key={data.id} data={data}/>
            </Col>
          </Row>
        </Container>
        <Container className="pb-5">
          <CheckIfOwner />
          <h3>Favorites:</h3>
          <FaveTileList />
        </Container>
        
      </>
  )
}

const UserPage = () => {
  const navigateTo = useNavigate();
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const type = localStorage.getItem("userType");
      const uid = localStorage.getItem("_id");
      const jwt = localStorage.getItem("token");

      try {
        const res = await fetch(`/api/v1/auth-required-func/${type}/${uid}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization : `Bearer ${jwt}`
          },
        });

        if (res.status == 401) {
          setIsLoggedIn(false);
        }

        const data = await res.json();
        setUserData(data);

        } catch (err) {
          console.error('User fetching error.', err);
        }
      };
      fetchData();
      
    }, []); 
    
  return (
      <>
        {isLoggedIn ? (
          <div>
            {isLoading ? (
              <Container className="d-flex align-items-center justify-content-center vh-100">
                <Spinner animation="border" role="status" size="lg">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Container>
            ) : (
              <Details data={userData}/>
            )}
          </div>
      ) : (
          <div>
            <Container>
              <h3>You must be logged in</h3>
            </Container>
          </div>
      )
        
        }
      </>
      
    );
  
};

export default UserPage;