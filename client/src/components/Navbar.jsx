import React, { useState } from 'react'
import { Navbar, Nav, Container, Dropdown, Button, OverlayTrigger, Popover, Row } from 'react-bootstrap'
import NavItem from './NavItem'
import { FaHeart, FaSignInAlt, FaLaughWink, FaUser, FaSignOutAlt } from 'react-icons/fa'


const PopOver = () => {
    return (
        <OverlayTrigger
            trigger="click"
            key="bottom"
            placement="bottom-start"
            overlay={
                <Popover id={`popover-positioned-bottom-start`}>
                    <Popover.Body>
                        <Container>
                            <Row>
                                <Nav.Link href="/user">
                                    <label className='d-flex align-items-center' style={{cursor: "pointer"}}>
                                        <FaLaughWink className='mx-2' color='#403234' size={20} />   
                                        <p className='mx-2'>Profile</p>   
                                    </label>
                                </Nav.Link>
                            </Row>
                            <Row>
                                <Nav.Link href="/login">
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
        <Nav.Link style={{ color: "white" }}>
                <label className='d-flex align-items-center' style={{cursor: "pointer"}}>
                    <FaLaughWink className='mx-2' color='#ffffff' size={20} />   
                    <p className='mx-2'>User</p>   
                </label>
        </Nav.Link>

        </OverlayTrigger>
    )
}



const NavBar = () => {
    // const [isVisible, setIsVisible] = useState(false)
    // const toggleVisible = () => {
    //     setIsVisible(!isVisible)
    // }
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
        <Navbar bg="primary" expand="lg">
            <Container>
                <Navbar.Brand style={{color:"white"}} href="/">Dormhub</Navbar.Brand>
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
                    
                    {navList}
                    <PopOver />
                    
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar;