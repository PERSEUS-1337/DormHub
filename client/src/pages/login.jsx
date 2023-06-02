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
      window.location.href = "/";
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
  
    const ownerLoginPromise = fetch(`/api/v1/auth/login/owner`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
  
    const userLoginPromise = fetch(`/api/v1/auth/login/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
  
    Promise.all([ownerLoginPromise, userLoginPromise])
      .then((responses) => Promise.all(responses.map((response) => response.json())))
      .then((bodies) => {
        const ownerResponse = bodies[0];
        const userResponse = bodies[1];
  
        if (ownerResponse.token) {
          localStorage.setItem("token", ownerResponse.token);
          localStorage.setItem("userType", "owner");
          console.log("owner");
          localStorage.setItem("_id", ownerResponse._id);
          setAuthenticated(true);
        } else if (userResponse.token) {
          localStorage.setItem("token", userResponse.token);
          localStorage.setItem("userType", "user");
          console.log("user");
          localStorage.setItem("_id", userResponse._id);
          setAuthenticated(true);
        } else {
          alert("Failed to log in");
        }
      });
  }

  /* can use this if backend is updated
  function login(e) {
  e.preventDefault();

  console.log("form submitted");
  console.log(form);

  const credentials = {
    email: form.email,
    password: form.password,
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
        const userType = body.owner ? "owner" : "user";
        localStorage.setItem("userType", userType);
        console.log(userType);

        localStorage.setItem("_id", body._id);
        setAuthenticated(true);
      } else {
        alert("Failed to log in");
      }
    });
}
  */ 

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