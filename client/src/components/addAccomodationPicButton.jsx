import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const AddAccommodationPicButton = ({ accommodationId }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('pics', file);
    });
  
    try {
      const jwt = localStorage.getItem('token');
      const res = await fetch(`/api/v1/auth-required-func/accommodation/upload/${accommodationId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: formData,
      });
  
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        closeModal();
      } else {
        const error = await res.json();
        console.error(error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFiles([]);
  };

  return (
    <div>
      <Button variant="primary" onClick={openModal}>Add Pictures</Button>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Pictures</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="file" multiple onChange={handleFileChange} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" onClick={handleUpload}>Upload</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddAccommodationPicButton;