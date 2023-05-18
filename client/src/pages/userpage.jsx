import { useState, useEffect } from "react";
import LodgingTileList from '../components/LodgingTileList';
import { Container } from "react-bootstrap";

const DeleteBookmark = () => {
    fetch('api/v1/auth/user/bookmark/:id/:uId', {
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
      .then(data => setUserData(data))
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
        <Container className="mt-5 d-flex flex-column align-items-center">
        <div>
          <h3>{`${userData.fname} ${userData.lname}`}</h3>
          <p className="text-center text-muted">@{`${userData.email}`}</p>
        </div>
        </Container>
        <Container>
          <h3>Favorites:</h3>
          <LodgingTileList />
        </Container>
        
      </>
    );
  }
  
};

export default UserPage;