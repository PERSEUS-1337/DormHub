import React, { useState } from 'react'
import { Navbar, Nav, Container, Dropdown, Button } from 'react-bootstrap'
import NavItem from './NavItem'



const NavBar = () => {
    const [isVisible, setIsVisible] = useState(false)
    const toggleVisible = () => {
        setIsVisible(!isVisible)
    }
    const nav_items = [
        {
            id: 1,
            name: "Favorites",
            href: "/user/favorites",
        },
        {
            id: 2,
            name: "Login",
            href: "/login",
        },
        {
            id: 3,
            name: "Signup",
            href: "/signup",
        },
        {
            id: 4,
            name: "Accommodation",
            href: "/accommodation",
        },
        {
            id: 5,
            name: "User",
            href: "/user",
        },
    ]

    const navList = nav_items.map(data => <NavItem key={data.id} nav={data} />)
    return (
        <Navbar bg="primary" expand="lg">
            <Container>
                <Navbar.Brand style={{color:"white"}} href="/">STALS</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                {/* <Nav>
                    <Dropdown className='ms-auto'>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Dropdown Button
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href="/login">Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Nav> */}
                <Nav className="ms-auto">
                    <Button>set visibility</Button>
                    {navList}
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar;