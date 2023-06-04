import { useState, useEffect } from "react";
import { Container, Col, Row, Image, Button, Modal, Form } from "react-bootstrap";
import FaveTileItem from "../components/FaveTileItem";
import EditUserProfile from "../components/EditUser";
import { Link, useNavigate } from "react-router-dom";

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
  const [vicinity, setVicinity] = useState([]);
  const [street, setStreet] = useState([]);
  const [barangay, setBarangay] = useState([]);
  const [town, setTown] = useState([]);
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

    const uId = localStorage.getItem("_id");
    const jwt = localStorage.getItem("token");

    const location = { 
      vicinity, street, barangay, town 
    };

    const formData = {
      uId, name, desc, price, location, type, amenity
    };
    console.log(formData)
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
      } else {
        console.error(data.error);
        alert("Creation failed.", data.error);
      }
    } catch (err) {
      console.error("Accommodation creation error.", err);
    }
  };
  const handleDeleteAccommodation = async (accommodationId) => {
    const oId = localStorage.getItem("_id");
    const jwt = localStorage.getItem("token");

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
  const navigateTo = useNavigate();
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

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

        if (res.status == 401) {
          setIsLoggedIn(false);
        }

        const data = await res.json();
        setUserData(data);
        setIsLoading(false);

        } catch (err) {
          console.error('User fetching error.', err);
        }
      };
      fetchData();
      
    }, []); 
    
  return (
      <>
        {isLoggedIn ? (
          <div>
            {isLoading ? (
              <Container className="d-flex align-items-center justify-content-center vh-100">
                <Spinner animation="border" role="status" size="lg">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Container>
            ) : (
              <Details data={userData}/>
            )}
          </div>
      ) : (
          <div>
            <Container>
              <h3>You must be logged in. Redirecting you to the login page.</h3>
              <p>if it is not working, <Link to="/login" style={{color: "black"}}> click here </Link></p>
            </Container>
          </div>
      )
        
        }
      </>
      
    );

};

export default UserPage;
