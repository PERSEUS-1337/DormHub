import { useState, useEffect } from "react";
import { Container, Col, Row, Image, Button, Modal, Form, Spinner } from "react-bootstrap";
import FaveTileItem from "../components/FaveTileItem";
import LodgingTileItem from "../components/LodgingTileItem";
import EditUserProfile from "../components/EditUser";

const AccommTileList = () => {
  const [accommData, setAccommData] = useState(null);
  const [hasAccomm, setHasAccomm] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchAccomms = async () => {
      const oid = localStorage.getItem("_id");
      const jwt = localStorage.getItem("token");

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

  const handleDeleteAccommodation = async (accommodationId) => {
    const oId = localStorage.getItem("_id");
    const jwt = localStorage.getItem("token");
    setDeleting(true);

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
        console.log(data.message);
        window.location.reload();
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
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });
      const data = await res.json();
      if (res.status === 200) {
        console.log(`${data.message}, id: ${accommodationId}`);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Accommodation archiving error.", err);
    }
  };

  if (hasAccomm === false) {
    return (
      <p>No Accommodations Uploaded Yet.</p>
    )
  } else {
    const LodgingList = accommData && accommData.map(data =>
      <>
        <LodgingTileItem key={data._id} data={data} />
        <Button variant="danger" onClick={() => handleDeleteAccommodation(data._id)} disabled={deleting}>
          Delete
        </Button>
        <Button variant="primary" onClick={() => handleArchiveAccommodation(data._id)}>
          Archive
        </Button>
      </>
    )
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
  const [isLoading, setIsLoading] = useState(true);

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

        if (data.error || data.length === 0) {
          setHasFav(false);
        } else {
          setFavData(data);
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Bookmark fetching error.', err);
      }
    };

    fetchBookmarks();
  }, []);

  console.log(favData);

  if (isLoading === true) {
    return (
      <Spinner animation="border" variant="secondary" role="status" size="lg">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    )
  } else {
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
  const [loadingPostResult, setLoadingPostResult] = useState(false);
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
    };
    fetchAccommodations();
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
    setLoadingPostResult(true);

    const formData = {
      oId, name, desc, price, location, type, amenity
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
        console.log(data.msg);
        closeModal();
        window.location.reload();
      } else {
        console.error(data.error);
        alert("Creation failed; fill-up all fields.");
      }
      setLoadingPostResult(false);
    } catch (err) {
      console.error("Accommodation creation error.", err);
    }
  };

  const userType = localStorage.getItem("userType");

  if (userType === "owner") {
    return (
      <>
        <h3>Accommodations:</h3>
        <div key={accommData._id} className="mb-3">
          <AccommTileList data={accommData} />
        </div>
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
                  as="select"
                  value={type}
                  onChange={(e) => setAccommodationType(e.target.value)}
                >
                  <option value="apartment">Apartment</option>
                  <option value="condominium">Condominium</option>
                  <option value="dormitory">Dormitory</option>
                  <option value="transient">Transient</option>
                  <option value="hotel">Hotel</option>
                  <option value="hostel">Hostel</option>
                  <option value="bedspace">Bedspace</option>
                </Form.Control>
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

              <Button className="" variant="secondary" type="submit" disabled={loadingPostResult}>
                {
                  loadingPostResult ? (
                    <Spinner animation="border" variant="primary" role="status" size="sm" disabled>
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>

                  ) : (
                    "Save"
                  )
                }
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
  const [isLoading, setIsLoading] = useState(true);
  const [hasPfp, setHasPfp] = useState(true);
  const [pfp, setPfp] = useState(null);

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
        console.log(userType)
        setIsLoading(false);
      } catch (err) {
        console.error('User fetching error.', err);
      }

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
    fetchData();
  }, []);

  console.log(userData.phone);

  return (
    <>
      <Container className="mt-5 mb-3 pb-4 d-flex flex-column align-items-left border-bottom">
        <>
        {
          isLoading ? (
            <div className="d-flex justify-content-center align-items-center">
              <Spinner animation="border" variant="primary" role="status" size="lg">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <Row>
              <Col xs={2}>
                {hasPfp === false ? (
                <p>No PFP.</p>
              ) : (
                <>
                  {pfp === "null" ? (
                    <Image
                      className="rounded-circle w-100 h-100"
                      src="https://i.pinimg.com/222x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg"
                    />
                  ) : (
                    <Image
                      className="rounded-circle w-100 h-100"
                      src={pfp}
                    />
                  )}
                </>
              )}
              </Col>
              <Col xs={7}>
                <h2>{`${userData.fname} ${userData.lname}`}</h2>
                {/* TO ADD: USER TYPE */}
                {/* <h5 className="lead">From Manila, Philippines</h5> */}
                <h5 className="lead">Email: {`${userData.email}`}</h5>
                <h5 className="lead">Contact Number: {
                  userData.phone.length === 0 || userData.phone[0] === "" ? (
                    <span className="text-muted">Edit Profile to Add</span>
                  ) : (
                    `${userData.phone}`
                  )
                } </h5>
              </Col>
              <Col xs={3} className="d-flex justify-content-end align-items-start">
                <EditUserProfile key={userData.id} data={userData} />
              </Col>
            </Row>
          )
        }
        
        </>
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
