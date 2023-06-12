import { useState, useEffect } from "react";
import { Container, Col, Row, Image, Button, Modal, Form, Spinner } from "react-bootstrap";
import FaveTileItem from "../components/FaveTileItem";
import LodgingTileItem from "../components/LodgingTileItem";
import EditUserProfile from "../components/EditUser";

const AccommTileList = () => {
  const [accommData, setAccommData] = useState(null);
  const [hasAccomm, setHasAccomm] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const handleClose = () => setShowDelete(false);

  useEffect(() => {
    const fetchAccomms = async () => {
      const oid = localStorage.getItem("_id");
      const jwt = localStorage.getItem("token");

      try {
        const res = await fetch(`/api/v1/auth-required-func/accommodations/${oid}`, {
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
    setArchiving(true);
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
    setArchiving(true);
    setDeleting(true);
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
        window.location.reload();
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
      {/* onClick={() => handleDeleteAccommodation(data._id)} */}
        <LodgingTileItem key={data._id} data={data} />
        <Button variant="danger" onClick={() => setShowDelete(true)}>
          Delete
        </Button>
        <Button className="m-1" variant="primary" onClick={() => handleArchiveAccommodation(data._id)} disabled={archiving}>
          {
            data.archived === false ? (
              `Archive`
            ) : (
              `Unarchive`
            )
          }
        </Button>
      </>
    )

    // console.log(accommData[0]);
    try {
      return (
        <>
        <Modal show={showDelete} backdrop="static" centered>
          <Modal.Body>
            <p>Do you really want to delete {accommData[0].name}?</p>
          </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={() => handleDeleteAccommodation(accommData[0]._id)} disabled={deleting}>
                Confirm
                </Button>
                <Button type="submit" variant="light" onClick={handleClose} disabled={deleting}>
                Cancel
                </Button>
            </Modal.Footer>
        </Modal>
          {LodgingList}
        </>
      )
    } catch (error) {
      console.error(error);
    }
    
  }
}

const FaveTileList = () => {
  const [favData, setFavData] = useState(null);
  const [hasFav, setHasFav] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      // const type = localStorage.getItem('userType');
      const uid = localStorage.getItem('_id');
      const jwt = localStorage.getItem('token');

      try {
        const res = await fetch(`/api/v1/auth-required-func/bookmark/${uid}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
        });
        const data = await res.json();
        if (data.error || data.length === 0) {
          setHasFav(false);
        } else {
          setFavData(data.list);
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
  const [vicinity, setVicinity] = useState([]);
  const [street, setStreet] = useState([]);
  const [barangay, setBarangay] = useState([]);
  const [town, setTown] = useState([]);
  const [type, setAccommodationType] = useState([]);
  const [amenity, setAccommodationAmenity] = useState([]);
  const [accommData, setAccommData] = useState([]);
  const [loadingPostResult, setLoadingPostResult] = useState(false);
  useEffect(() => {
    const fetchAccommodations = async () => {
      const oid = localStorage.getItem("_id");
      const jwt = localStorage.getItem("token");

      try {
        const res = await fetch(`/api/v1/auth-required-func/accommodations/${oid}`, {
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

    const uId = localStorage.getItem("_id");
    const jwt = localStorage.getItem("token");
    setLoadingPostResult(true);

    const location = { 
      vicinity, street, barangay, town 
    };

    const formData = {
      uId, name, desc, price, location, type, amenity
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
      console.log(formData);
      if (res.status === 201) {
        console.log(data.msg);
        closeModal();
        window.location.reload();
      } else {
        console.error(data.error);
        alert("Creation failed.", data.error);
      }
      setLoadingPostResult(false);
    } catch (err) {
      console.error("Accommodation creation error.", err);
    }
  };

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
                as="textarea"
                type="text"
                placeholder="Enter accommodation description"
                value={desc}
                onChange={(e) => setAccommodationDesc(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="accommodationPrice">
              <Form.Label>Price <span className="text-muted">/month</span></Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setAccommodationPrice(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="locationVicinity">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Vicinity"
                value={vicinity}
                onChange={(e) => setVicinity(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="locationStreet">
              <Form.Control
                type="text"
                placeholder="Enter Street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="locationBarangay">
              <Form.Control
                type="text"
                placeholder="Enter Barangay"
                value={barangay}
                onChange={(e) => setBarangay(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="locationTown">
              <Form.Control
                type="text"
                placeholder="Enter Town"
                value={town}
                onChange={(e) => setTown(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="accommodationType">
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                value={type}
                onChange={(e) => setAccommodationType(e.target.value)}
              >
                <option value="" ></option>
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
};

const UserPage = () => {
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasPfp, setHasPfp] = useState(true);
  const [pfp, setPfp] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // const type = localStorage.getItem("userType");
      const uid = localStorage.getItem("_id");
      const jwt = localStorage.getItem("token");

      try {
        const res = await fetch(`/api/v1/auth-required-func/${uid}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`
          },
        });
        const data = await res.json();
        setUserData(data);
        // console.log(data);
        // const userType = localStorage.getItem("userType");
        // console.log(userType)
        setIsLoading(false);
      } catch (err) {
        console.error('User fetching error.', err);
      }

      try {
        const res = await fetch(`/api/v1/auth-required-func/pfp/${uid}`, {
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
                <h2>{`${userData.user.fname} ${userData.user.lname}`}</h2>
                {/* TO ADD: USER TYPE */}
                <h5 className="lead">{`${userData.user.userType}`}</h5>
                <h5 className="lead">Email: {`${userData.user.email}`}</h5>
                <h5 className="lead">Contact Number: {
                  userData.user.phone.length === 0 || userData.user.phone[0] === "" ? (
                    <span className="text-muted">Edit Profile to Add</span>
                  ) : (
                    `${userData.phone}`
                  )
                } </h5>
              </Col>
              <Col xs={3} className="d-flex justify-content-end align-items-start">
                <EditUserProfile key={userData.user.id} data={userData} />
              </Col>
            </Row>
          )
        }
        
        </>
      </Container>
      <Container>
        {
          userData.user && userData.user.userType === "Owner" ? (
            // console.log("Owner"),
            <CheckIfOwner />
          ) : (
            <></>
          )
        }
        
        <h3>Favorites:</h3>
        <FaveTileList />
      </Container>
    </>
  );

};

export default UserPage;
