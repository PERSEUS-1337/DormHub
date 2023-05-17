import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Form, InputGroup, Alert } from "react-bootstrap";
import "./style.css";

const Login = () => {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [authentication, setAuthenticated] = useState(false);
  const [userType, setUserType] = useState("user"); // "user" or "owner"
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

  const validateForm = () => {
    const { email, password } = form;
    const blankFields = {};

    if (!email || email === "") {
      blankFields.email = "Please enter your email address!";
    }

    if (!password || password === "") {
      blankFields.password = "Please enter your password!";
    }

    return blankFields;
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

  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  function login(e) {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    console.log("form submitted");
    console.log(form);

    const credentials = {
      email: form.email,
      password: form.password,
    };

    fetch(`/api/v1/login/${userType}`, {
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
          setAuthenticated(true);
        } else {
          alert("Failed to log in");
        }
      });
  }

  return (
    <>
      <div className="login-container">
        <Container className="form-control">
          <h2>Login</h2>
          <br />
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
            <br />
            <Form.Group controlId="form-control">
              <Form.Label className="input-label">Password</Form.Label>
              <InputGroup>
                <Form.Control
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
            <Form.Group controlId="formradio">
              <Form.Check
                type="radio"
                name="userType"
                id="user"
                label="User"
                checked={userType === "user"}
                onChange={() => handleUserTypeChange("user")}
              />
              <Form.Check
                type="radio"
                name="userType"
                id="owner"
                label="Owner"
                checked={userType === "owner"}
                onChange={() => handleUserTypeChange("owner")}
              />
            </Form.Group>
            <br />
            <Button type="submit">Login</Button>
            <Button onClick={handleSignupClick}>Go to Signup</Button>
          </Form>
        </Container>
      </div>
    </>
  );
};
export default Login;