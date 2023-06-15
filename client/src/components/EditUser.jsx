import React, { useState , useRef} from 'react';
import { Modal, Button , Form } from 'react-bootstrap';


const EditUserProfile = ({data}) => {
    const [form, setForm] = useState({});
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
        // const type = localStorage.getItem("userType");
        const oid = localStorage.getItem("_id");
        const jwt = localStorage.getItem("token");

        console.log(form);

        const details = {
            fname: form.fname,
            lname: form.lname,
            phone: form.phone,
            email: form.email
        };

        const formData = new FormData();
        formData.append('pfp', file);
        const boundary = Math.random().toString().substr(2); // Generate a random boundary

        fetch(`/api/v1/auth-required-func/${oid}`, {
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

        const image = new Image();
        try {
          image.src = URL.createObjectURL(file);
          image.onload = function() {
            const width = this.width;
            const height = this.height;
              
            if (width !== height) {
              // Alert the user that the picture is not square
              alert("Please upload a square profile picture.");
            } else {
                fetch(`/api/v1/auth-required-func/upload-pfp/${oid}`, {
                  method: 'POST',
                  headers: {
                    //'Content-Type': 'multipart/form-data',
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
                }}
        } catch(error) {
          console.error(error);
        }
      window.location.reload();
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
                  placeholder={data.user.fname}
                  defaultValue={form.fname || data.user.fname}
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
                  placeholder={data.user.lname}
                  defaultValue={form.lname || data.user.lname}
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
              <Form.Group className="mb-3" controlId="phone">
                <Form.Label>Contact Number</Form.Label>
                <Form.Control
                  placeholder={data.user.phone}
                  defaultValue={form.phone || data.user.phone}
                  onChange={(e) => {
                    if(e.target.value == "" || e.target.value == null){
                      setField("phone", "");
                    }else{
                      setField("phone", e.target.value);
                    }
                  }
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  placeholder={data.user.email}
                  defaultValue={form.email || data.user.email}
                  onChange={(e) => {
                    if(e.target.value == "" || e.target.value == null){
                      setField("email", "");
                    }else{
                      setField("email", e.target.value);
                    }
                  }
                  }
                  isInvalid={!!errors.email}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="pfp" encType="multipart/form-data">
                <Form.Label>Profile Picture</Form.Label>
                <Form.Control type="file" name="pfp" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
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