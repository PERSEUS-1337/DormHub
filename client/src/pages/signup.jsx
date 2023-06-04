import React, { useState } from 'react';
import { Form, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './style.css';

const Signup = () => {
  const [fname, setfName] = useState('');
  const [lname, setlName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('User');
  const navigateTo = useNavigate();

  const handleLoginClick = () => {
    navigateTo('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { fname, lname, email, password, userType };
    console.log(formData);

    function login() {
  
      const credentials = {
        email: formData.email,
        password: formData.password,
      };
  
      fetch(`/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })
        .then((response) => response.json())
        .then((body) => {
          console.log(body);
  
          if (body.token) {
            localStorage.setItem("token", body.token);
            localStorage.setItem("_id", body._id);
          } else {
            alert("Failed to log in");
          }
        });
    }
  
    try {
      const res = await fetch(`/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        console.log('Registration Successful');
        console.log(fname, lname, email, password, userType);
        login();
        window.location.href = "/";
      } else {
        console.error('Registration failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="signup-container">
        <h2>Create an <span style={{ color: '#ffd041' }}>Account</span></h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              value={fname}
              onChange={(e) => setfName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              value={lname}
              onChange={(e) => setlName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip id="password-tooltip">
                  Password should be of length 8 or more and must contain an uppercase letter,
                  a lowercase letter, a digit, and a symbol.
                </Tooltip>
              }
            >
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </OverlayTrigger>
          </Form.Group>
          <Form.Group controlId="formUserType">
            <Form.Label>User Type:</Form.Label>
            <Form.Select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="User">User</option>
              <option value="Owner">Owner</option>
            </Form.Select>
          </Form.Group>
          <br />
          <Button type="submit" variant="secondary">CREATE ACCOUNT</Button>
          <br />
          <Button onClick={handleLoginClick} variant="light">GO TO LOGIN</Button>
        </Form>
      </div>
    </>
  );
};

export default Signup;
