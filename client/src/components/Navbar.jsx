import React, { useState, useEffect } from 'react'
import { Navbar, Nav, Container, Dropdown, Button, OverlayTrigger, Popover, Row } from 'react-bootstrap'
import NavItem from './NavItem'
import { FaHeart, FaSignInAlt, FaLaughWink, FaUser, FaSignOutAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const handleLogout = () => {
    localStorage.clear();
}



const PopOver = ({ data }) => {
    // const navigateTo = useNavigate()
    
    // const handleLogin = ({ data }) => {
    
    //     if (data == {}) {
    //         navigateTo("/user")
    //     } else {
    //         console.log("You're not logged in")
    //     }
    // }

    return (
        <OverlayTrigger
            trigger="click"
            key="bottom"
            placement="bottom-start"
            rootClose
            overlay={
                <Popover id={`popover-positioned-bottom-start`}>
                    <Popover.Body>
                        <Container>
                            <Row>
                                <Nav.Link href='/user'>
                                    <label className='d-flex align-items-center' style={{cursor: "pointer"}}>
                                        <FaLaughWink className='mx-2' color='#403234' size={20} />   
                                        <p className='mx-2'>Profile</p>   
                                    </label>
                                </Nav.Link>
                            </Row>
                            <Row>
                                <Nav.Link href="/login" onClick={handleLogout}>
                                    <label className='d-flex align-items-center' style={{cursor: "pointer"}}>
                                        <FaSignOutAlt className='mx-2' color='#403234' size={20} />   
                                        <p className='mx-2'>Logout</p>   
                                    </label>
                                </Nav.Link>
                                        
                            </Row>
                        </Container>
                    </Popover.Body>
                </Popover>
            }
        >
        {
                data && data ?
                <Nav.Link style={{ color: "white" }}>
                    <label className='d-flex align-items-center' style={{cursor: "pointer"}}>
                        <FaLaughWink className='mx-2' color='#ffffff' size={20} />   
                        <p className='mx-2'>{ data }</p>   
                    </label>
                </Nav.Link>
                    :
                <Nav.Link style={{ color: "white" }} href='/login'>
                    <label className='d-flex align-items-center' style={{cursor: "pointer"}}>
                        <FaLaughWink className='mx-2' color='#ffffff' size={20} />   
                        <p className='mx-2'>Login</p>   
                    </label>
                </Nav.Link>
        }
        

        </OverlayTrigger>
    )
}



const NavBar = () => {
    // const [isVisible, setIsVisible] = useState(false)
    // const toggleVisible = () => {
    //     setIsVisible(!isVisible)
    // }

    const [userData, setUserData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

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
            // setUserName(data.fname)
            setIsLoading(false);
            console.log(data);
            } catch (err) {
            console.error('User fetching error.', err);
            }
        };
        fetchData();
        
    }, []); 
    console.log("name: " + userData)
    
    const nav_items = [
        // {
        //     id: 1,
        //     icon: <FaHeart className='mx-2' color='#ffffff' size={20} />,
        //     name: "Favorites",
        //     href: "/user",
        // },
        {
            id: 2,
            icon: <FaSignInAlt className='mx-2' color='#ffffff' size={20} />,
            name: "Login",
            href: "/login",
        },
        {
            id: 3,
            icon: <FaUser className='mx-2' color='#ffffff' size={20} />,
            name: "Signup",
            href: "/signup",
        },
        // {
        //     id: 4,
        //     icon: <FaLaughWink className='mx-2' color='#ffffff' size={20} />,
        //     name: "User",
        //     href: "/user",
        // },

    ]

    const navList = nav_items.map(data => <NavItem key={data.id} nav={data} />)
    return (
        <Navbar bg="primary" expand="lg" className="fixed-navbar">
            <Container>
                <Navbar.Brand style={{color:"white"}} href="/">DORMHUB</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto d-flex align-items-center">
                        
                    <Nav.Link style={{color: "white"}} href="/user">
                        <label className='d-flex align-items-center' style={{cursor: "pointer"}}>
                            <FaHeart className='mx-2'
                            color='#ffffff'
                            size={20}
                            />
                            <p className='mx-2'>Favorites</p>   
                        </label>
                     </Nav.Link>
                    
                    {/* {navList} */}
                    <PopOver data={ userData.fname } />
                    
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar;