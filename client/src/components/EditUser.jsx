import React, { useState } from 'react';
import { Modal, Button , Form } from 'react-bootstrap';


const EditUserProfile = ({data}) => {
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
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
    
    function saveChanges(e) {
        e.preventDefault();
        const type = localStorage.getItem("userType");
        const oid = localStorage.getItem("_id");
        const jwt = localStorage.getItem("token");

        console.log(form);

        const details = {
            fname: form.fname,
            lname: form.lname,
        };

        
        fetch(`/api/v1/auth-required-func/${type}/${oid}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
                body: JSON.stringify(details),
        })
            .then((response) => response.json())
            .then((body) => {
                console.log(body);
        });

        window.location.reload();
    };
  
    return (
      <>
        <Button variant="primary" onClick={handleShow}>
          Edit Details
        </Button>
  
        <Modal show={show} onHide={handleClose} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile Details</Modal.Title>
          </Modal.Header>
          <Form onSubmit={saveChanges}>
          <Modal.Body>
              <Form.Group className="mb-3" controlId="fname">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  placeholder={data.fname}
                  value={form.fname || data.fname || ""}
                  onChange={(e) => setField("fname", e.target.value)}
                  isInvalid={!!errors.fname}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="lname">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  placeholder={data.lname}
                  value={form.lname || data.lname  || ""}
                  onChange={(e) => setField("lname", e.target.value)}
                  isInvalid={!!errors.lname}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Example textarea</Form.Label>
                <Form.Control as="textarea" rows={3} />
              </Form.Group>
            
          </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                Close
                </Button>
                <Button type="submit" variant="primary" onClick={handleClose}>
                Save
                </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </>
    );
}

export default EditUserProfile;