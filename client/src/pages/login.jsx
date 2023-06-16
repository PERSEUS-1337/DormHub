import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Form, InputGroup } from "react-bootstrap";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./style.css";

const Login = () => {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [authentication, setAuthenticated] = useState(false);

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

  const login = async (e) => {
    e.preventDefault();
    console.log("form submitted");
    console.log(form);

    const credentials = {
      email: form.email,
      password: form.password,
    };

    try {
      const response = await fetch(`/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const body = await response.json();

        if (body.token) {
          localStorage.setItem("token", body.token);
          localStorage.setItem("_id", body._id);
          setAuthenticated(true);
          toast.success("Login successful", {
            autoClose: 3000, 
          });
          window.location.href = "/";
        } else {
          alert("Failed to log in");
        }
      } else {
        const errorData = await response.json();
        let errorMessage = "Login failed.";
        errorMessage += " " + errorData.err;
        toast.error(errorMessage, {
          autoClose: 3000, 
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during login", {
        autoClose: 3000, 
      });
    }
  };

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
      <ToastContainer />
    </>
  );
};

export default Login;
