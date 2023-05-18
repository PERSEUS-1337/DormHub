import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "./style.css";

const Signup = () => {
  const [fName, setfName] = useState('');
  const [lName, setlName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigateTo= useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = { fName, lName, email, password };

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      console.log(res);
      // handle success
    } catch (err) {
      console.error(err);
      // handle error
    }
  };

  return (
    <>
    <div className='signup-container'>
      <h2>Create an account</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter first name"
            value={fName}
            onChange={(e) => setfName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter last name"
            value={lName}
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
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button type="submit">Create Account</Button>
        {/* <Button onClick={navigateTo("/login")}>Go to Login</Button>   */}
      </Form>
    </div>
    </>
  );
};

export default Signup;
