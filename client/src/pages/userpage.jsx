import { useState, useEffect } from "react";
import { Container, Col, Row, Image, Button, Modal, Form } from "react-bootstrap";
import FaveTileItem from "../components/FaveTileItem";
import EditUserProfile from "../components/EditUser";

//BACKLOGS: Create functional loading before data appears

const ProfilePic = () => {
  const [hasPfp, setHasPfp] = useState(true);
  const [pfp, setPfp] = useState(null);

  useEffect(() => {
    const fetchPfp = async () => {
      const type = localStorage.getItem('userType');
      const uid = localStorage.getItem('_id');
      const jwt = localStorage.getItem('token');
      // console.log(type);
      // console.log(uid);

      try {
        const res = await fetch(`/api/v1/auth-required-func/${type}/pfp/${uid}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
        });
        const data = await res.json();
        // console.log(data.pfp);
        setPfp(data.pfp);

        if (data.error) {
          setHasPfp(false);
        } 
      } catch (err) {
        console.error('PFP fetching error.', err);
      }
    };
    fetchPfp();
  }, []);
  if (hasPfp === false) {
    return (
      <p>No PFP.</p>
    )
  } else {
    console.log(pfp);
    if (pfp === "null"){
      // console.log("pfp!= " + pfp);
      return (
        <Image className="rounded-circle w-100 h-100" src="https://i.pinimg.com/222x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg" />
      )
    } else {
      return (
        <Image className="rounded-circle w-100 h-100" src="https://pixy.org/src/364/thumbs350/3648362.jpg" />
      )
    }
  }
}

const AccommTileList = () => {
  const [accommData, setAccommData] = useState(null);
  const [hasAccomm, setHasAccomm] = useState(true);

  useEffect(() => {
    const fetchAccomms = async () => {
      const oid = localStorage.getItem("_id");
      // console.log(oid);
      const jwt = localStorage.getItem("token");
      // console.log(jwt);

      try {
        const res = await fetch(`/api/v1/auth-required-func/owner/accommodation/${oid}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`
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
    return (
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
    return (
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
  const [name, setAccommodationName] = useState("");
  const [desc, setAccommodationDesc] = useState("");
  const [price, setAccommodationPrice] = useState([]);
  const [location, setAccommodationLocation] = useState("");
  const [type, setAccommodationType] = useState([]);
  const [amenity, setAccommodationAmenity] = useState([]);
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
    }; fetchAccommodations();
  }, []);
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const oId = localStorage.getItem("_id");
    const jwt = localStorage.getItem("token");

    const formData = {
      oId, name, desc, price, location, type, amenity
    };
    // console.log(formData)
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
        // console.log(data.msg);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Accommodation creation error.", err);
    }
  };
  const handleDeleteAccommodation = async (accommodationId) => {
    const oId = localStorage.getItem("_id");
    const jwt = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/v1/auth-required-func/accommodation/${accommodationId}/${oId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });
      const data = await res.json();
      if (res.status === 200) {
        // console.log(data.message);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Accommodation deletion error.", err);
    }
  };
  const handleArchiveAccommodation = async (accommodationId) => {
    const oId = localStorage.getItem("_id");
    const jwt = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/v1/auth-required-func/accommodation/archive/${accommodationId}/${oId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });
      const data = await res.json();
      if (res.status === 200) {
        // console.log(data.message);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Accommodation archiving error.", err);
    }
  };
  const userType = localStorage.getItem("userType");

  if (userType === "owner") {
    return (
      <>
        <h3>Accommodations:</h3>
        <AccommTileList />
        {accommData.map((accommodation) => (
          <div key={accommodation._id} className="mb-3">
            <Button variant="danger" onClick={() => handleDeleteAccommodation(accommodation._id)}>
              Delete
            </Button>
            <Button variant="primary" onClick={() => handleArchiveAccommodation(accommodation._id)}>
              Archive
            </Button>
          </div>
        ))}

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
                  value={name}
                  onChange={(e) => setAccommodationName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="accommodationDesc">
                <Form.Label>Accommodation Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter accommodation description"
                  value={desc}
                  onChange={(e) => setAccommodationDesc(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="accommodationPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setAccommodationPrice(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="accommodationLocation">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter location"
                  value={location}
                  onChange={(e) => setAccommodationLocation(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="accommodationType">
                <Form.Label>Type</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter type"
                  value={type}
                  onChange={(e) => setAccommodationType(e.target.value)}
                />
              </Form.Group>


              <Form.Group controlId="accommodationAmenity">
                <Form.Label>Amenity</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter amenity"
                  value={amenity}
                  onChange={(e) => setAccommodationAmenity(e.target.value)}
                />
              </Form.Group>

              <Button variant="primary" type="submit">
                Save
              </Button>
            </Form>
          </Modal.Body>
        </Modal>


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
            Authorization: `Bearer ${jwt}`
          },
        });
        const data = await res.json();
        setUserData(data);
        // console.log(data);
        const userType = localStorage.getItem("userType");
        // console.log(userType)
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
            {/* <ProfilePic /> */}
          </Col>
          <Col xs={7}>
            <h2>{`${userData.fname} ${userData.lname}`}</h2>
            <h5 className="lead">From Manila, Philippines</h5>
            <h5 className="lead">Email: {`${userData.email}`}</h5>
            <h5 className="lead">Contact Number: 09950055973 </h5>
          </Col>
          <Col xs={3} className="d-flex justify-content-end align-items-start">
            <EditUserProfile key={userData.id} data={userData} />
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
