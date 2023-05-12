import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";

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
  }, []);
  return (
    <>
      {/* You can change your implementation here, but this works for now, completely up to the frontend */}
      <Container className="mt-5 d-flex flex-column align-items-center">
       <div><h2>{`${userData.fname} ${userData.lname}`}</h2><p className="lead">{userData.email}</p></div>
      </Container>
    </>
  );
};

export default UserPage;