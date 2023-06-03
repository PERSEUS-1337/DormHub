import React, { useState , useRef} from 'react';
import { Modal, Button , Form } from 'react-bootstrap';


const EditUserProfile = ({data}) => {
    const [form, setForm] = useState({"fname": data.fname, "lname": data.lname});
    const [errors, setErrors] = useState({});
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [file, setFile] = useState(null);


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

        const formData = new FormData();
        formData.append('pfp', file);

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

        fetch(`/api/v1/auth-required-func/${type}/upload-pfp/${oid}`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`
        },
          body: formData,
        })
          .then(response => response.json())
          .then(data => {
            // Handle the response data
            console.log(data);
          })
          .catch(error => {
            // Handle the error
            console.error(error);
          });
    };
  
    return (
      <>
        <Button variant="light" onClick={handleShow}>
          Edit Details
        </Button>
  
        <Modal show={show} onHide={handleClose} backdrop="static" centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile Details</Modal.Title>
          </Modal.Header>
          <Form onSubmit={saveChanges} encType="multipart/form-data">
          <Modal.Body>
              <Form.Group className="mb-3" controlId="fname">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  // placeholder={data.fname}
                  value={form.fname}
                  onChange={(e) => {
                    if(e.target.value == "" || e.target.value == null){
                      setField("fname", "");
                    }else{
                      setField("fname", e.target.value);
                    }
                  }
                  }
                  isInvalid={!!errors.fname}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="lname">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  // placeholder={data.lname}
                  value={form.lname}
                  onChange={(e) => {
                    if(e.target.value == "" || e.target.value == null){
                      setField("lname", "");
                    }else{
                      setField("lname", e.target.value);
                    }
                  }
                }
                  isInvalid={!!errors.lname}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="pfp">
                <Form.Label>Profile Picture</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
              </Form.Group>
          </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                Close
                </Button>
                <Button type="submit" variant="secondary" onClick={handleClose}>
                Save
                </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </>
    );
}


export default EditUserProfile;