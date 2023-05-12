import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";

const UserPage = () => {
  useEffect(() => {
    fetch("/api/v1/accommodation/")
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
  });

  return (
    <>
      <Container className="mt-5 d-flex flex-column align-items-center">
        <img
          src={userData.profilePicture}
          className="rounded-circle mb-4"
          style={{ width: "200px", height: "200px", objectFit: "cover" }}
        />
        <h2>{userData.fname} {userData.lname}</h2>
        <p className="lead">{userData.email}</p>
      </Container>
    </>
  );
};

export default UserPage;
