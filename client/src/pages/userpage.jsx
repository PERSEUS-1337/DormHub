import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";

const UserPage = () => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    fetch("/api/user")
      .then((response) => response.json())
      .then((data) => setUserData(data));
  }, []);

  return (
    <>
      <Container className="mt-5 d-flex flex-column align-items-center">
        <img
          src={userData.profilePicture}
          className="rounded-circle mb-4"
          style={{ width: "200px", height: "200px", objectFit: "cover" }}
        />
        <h2>{userData.name}</h2>
        <p className="lead">{userData.email}</p>
      </Container>
    </>
  );
};

export default UserPage;
