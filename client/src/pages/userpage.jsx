import { useState, useEffect } from "react";
import { Container, Col, Row, Image, Button, Modal, Form } from "react-bootstrap";
import FaveTileItem from "../components/FaveTileItem";
import EditUserProfile from "../components/EditUser";

//BACKLOGS: Create functional loading before data appears

const ProfilePic = () => {
  return (
    <Image className="rounded-circle w-100 h-100" src="https://i.pinimg.com/222x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg" />
  );
}

const AccommTileList = () => {
  const [accommData, setAccommData] = useState(null);
  const [hasAccomm, setHasAccomm] = useState(true);

  useEffect(() => {
    const fetchAccomms = async () => {
      const oid = localStorage.getItem("_id");
      console.log(oid);
      const jwt = localStorage.getItem("token");
      console.log(jwt);

      try {
        const res = await fetch(`/api/v1/auth-required-func/owner/accommodation/${oid}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization : `Bearer ${jwt}`
          },
        });
        const owned = await res.json();
        setAccommData(owned.accommodations);
        if (owned.error) {
          setHasAccomm(false);
        }
        } catch (err) {
          console.error('Bookmark fetching error.', err);
        }
      };
      fetchAccomms();
    }, []); 

    if (hasAccomm === false) {
      return(
        <p>No Accommodations Uploaded Yet.</p>
      )
    } else {
      const LodgingList = accommData && accommData.map(data => <FaveTileItem key={data._id} data={data} />)
      return (
        <>
          {LodgingList}
        </>
      )
    }
}

const FaveTileList = () => {
  const [favData, setFavData] = useState(null);
  const [hasFav, setHasFav] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      const type = localStorage.getItem('userType');
      const uid = localStorage.getItem('_id');
      const jwt = localStorage.getItem('token');

      try {
        const res = await fetch(`/api/v1/auth-required-func/${type}/bookmark/${uid}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
        });
        const data = await res.json();

        if (data.error) {
          setHasFav(false);
        } else {
          setFavData(data);
        }
      } catch (err) {
        console.error('Bookmark fetching error.', err);
      }
    };

    fetchBookmarks();
  }, []);

  if (hasFav === false) {
    return(
      <p>No Favorites Yet.</p>
    )
  } else {
    const BkmarkList = favData && favData.map(data => <FaveTileItem key={data.id} data={data} />)
    return (
      <>
        {BkmarkList}
      </>
    )
}
}

const CheckIfOwner = () => {
  const [showModal, setShowModal] = useState(false);
  const [accommodationName, setAccommodationName] = useState("");
  const [accommodationPrice, setAccommodationPrice] = useState("");
  const [accommodationLocation, setAccommodationLocation] = useState("");
  const [accommodationType, setAccommodationType] = useState("");
  const [accommodationRating, setAccommodationRating] = useState("");
  const [accommodationAmenity, setAccommodationAmenity] = useState("");
  const [accommData, setAccommData] = useState([]);
  useEffect(() => {
    const fetchAccommodations = async () => {
      const oid = localStorage.getItem("_id");
      const jwt = localStorage.getItem("token");

      try {
        const res = await fetch(`/api/v1/auth-required-func/owner/accommodation/${oid}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        });
        const data = await res.json();
        if (data.error) {
          setAccommData([]);
        } else {
          setAccommData(data.accommodations);
        }
      } catch (err) {
        console.error('Accommodations fetching error.', err);
      }
    };   fetchAccommodations();
  }, []);
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const oid = localStorage.getItem("_id");
    const jwt = localStorage.getItem("token");

    const formData = {
      oId: oid,
      name: accommodationName,
      price: accommodationPrice,
      location: accommodationLocation,
      type: accommodationType,
      rating: accommodationRating,
      amenity: accommodationAmenity,
    };
    
    try {
      const res = await fetch("/api/v1/auth-required-func/accommodation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.status === 201) {
        console.log(data.msg); // Accommodation created successfully
        // Perform any additional actions or state updates upon successful accommodation creation
      } else {
        console.error(data.error); // Error creating accommodation
        // Perform any error handling or display error message to the user
      }
    } catch (err) {
      console.error("Accommodation creation error.", err);
      // Perform any error handling or display error message to the user
    }
  };
  const handleDeleteAccommodation = async (accommodationId) => {
    const oid = localStorage.getItem("_id");
    const jwt = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/v1/auth-required-func/owner/accommodation/${accommodationId}/${oid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });
      const data = await res.json();
      if (res.status === 200) {
        console.log(data.message); // Accommodation deleted successfully
        // Perform any additional actions or state updates upon successful deletion
      } else {
        console.error(data.error); // Error deleting accommodation
        // Perform any error handling or display error message to the user
      }
    } catch (err) {
      console.error("Accommodation deletion error.", err);
      // Perform any error handling or display error message to the user
    }
  };
  const userType = localStorage.getItem("userType");

  if (userType === "owner") {
    return (
      <>
        <h3>Accommodations:</h3>
        <AccommTileList />
        <Button variant="primary" className="mb-3" onClick={openModal}>
          Add Accommodation
        </Button>
        <Modal show={showModal} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Accommodation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="accommodationName">
                <Form.Label>Accommodation Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter accommodation name"
                  value={accommodationName}
                  onChange={(e) => setAccommodationName(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="accommodationPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter price"
                  value={accommodationPrice}
                  onChange={(e) => setAccommodationPrice(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="accommodationLocation">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter location"
                  value={accommodationLocation}
                  onChange={(e) => setAccommodationLocation(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="accommodationType">
                <Form.Label>Type</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter type"
                  value={accommodationType}
                  onChange={(e) => setAccommodationType(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="accommodationRating">
                <Form.Label>Rating</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter rating"
                  value={accommodationRating}
                  onChange={(e) => setAccommodationRating(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="accommodationAmenity">
                <Form.Label>Amenity</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter amenity"
                  value={accommodationAmenity}
                  onChange={(e) => setAccommodationAmenity(e.target.value)}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Save
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
        {accommData.map((accommodation) => (
          <div key={accommodation._id} className="mb-3">
            <FaveTileItem data={accommodation} />
            <Button variant="danger" onClick={() => handleDeleteAccommodation(accommodation._id)}>
              Delete
            </Button>
            </div>
        ))}
      </>
    );
  } else {
    return null;
  }
};

const UserPage = () => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const type = localStorage.getItem("userType");
      const uid = localStorage.getItem("_id");
      const jwt = localStorage.getItem("token");

      try {
        const res = await fetch(`/api/v1/auth-required-func/${type}/${uid}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization : `Bearer ${jwt}`
          },
        });
        const data = await res.json();
        setUserData(data);
        console.log(data);
        const userType = localStorage.getItem("userType");
        console.log(userType)
        } catch (err) {
          console.error('User fetching error.', err);
        }
      };
      fetchData();
    }, []); 

    return (
      <>
        <Container className="mt-5 mb-3 pb-4 d-flex flex-column align-items-left border-bottom">
          <Row> 
            <Col xs={2}>
              <ProfilePic />
            </Col>
            <Col xs={7}>
              <h2>{`${userData.fname} ${userData.lname}`}</h2>
              <h5 className="lead">From Manila, Philippines</h5>
              <h5 className="lead">Email: {`${userData.email}`}</h5>
              <h5 className="lead">Contact Number: 09950055973 </h5>
            </Col>
            <Col xs={3} className ="d-flex justify-content-end align-items-start">
              <EditUserProfile key={userData.id} data={userData}/>
            </Col>
          </Row>
        </Container>
        <Container>
          <CheckIfOwner />
          <h3>Favorites:</h3>
          <FaveTileList />
        </Container>  
      </>
    );
  
};

export default UserPage;