import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Form, InputGroup } from "react-bootstrap";
import "./style.css";

const Login = () => {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [authentication, setAuthenticated] = useState(false);
  const [userType, setUserType] = useState("user");
  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });

    if (!!errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  const navigateTo = useNavigate();
  const handleSignupClick = () => {
    navigateTo("/signup");
  };
  useEffect(() => {
    if (authentication) {
      navigateTo("/");
    }
  }, [authentication]);

  function login(e) {
    e.preventDefault();

    console.log("form submitted");
    console.log(form);

    const credentials = {
      email: form.email,
      password: form.password,
    };

    fetch(`/api/v1/auth/login/${userType}`, {
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
          localStorage.setItem("userType", userType);
          console.log(userType);
          localStorage.setItem("_id", body._id);
          setAuthenticated(true);
        } else {
          alert("Failed to log in");
        }
      });
  }

  return (
    <>
      <div className="signup-container">
        <Container>
          <h2>LOG<span style={{ color: '#ffd041' }}>IN</span></h2>
          <Form onSubmit={login}>
            <Form.Group controlId="form-control">
              <Form.Label className="input-label">Email</Form.Label>
              <Form.Control
                title="Enter email"
                placeholder="Enter email"
                value={form.email || ""}
                onChange={(e) => setField("email", e.target.value)}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="form-control">
              <Form.Label className="input-label">Password</Form.Label>
              <InputGroup>
                <Form.Control
                type="password"
                  title="Enter password"
                  placeholder="Enter password"
                  value={form.password || ""}
                  onChange={(e) => setField("password", e.target.value)}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
           
            <Form.Group controlId="formUserType">
            <Form.Label>User Type:</Form.Label>
            <br />
            <Form.Check
              inline
              type="radio"
              label="User"
              name="userType"
              value="studentuser"
              checked={userType === 'user'}
              onChange={() => setUserType('user')}
            />
            <Form.Check
              inline
              type="radio"
              label="Owner"
              name="userType"
              value="owner"
              checked={userType === 'owner'}
              onChange={() => setUserType('owner')}
            />
          </Form.Group>
            <br />
            <Button type="submit">Login</Button>
            <br />

            <Button onClick={handleSignupClick}>Go to Signup</Button>
          </Form>
        </Container>
      </div>
    </>
  );
};
export default Login;