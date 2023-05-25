import React from 'react'
import { Nav } from 'react-bootstrap'

const handleLogout = () => {
    localStorage.clear();
}

const NavItem = ({ nav }) => {
    if (nav.id == '5') {
        return (
            <Nav.Link style={{color: "white"}} href={nav.href} onClick={handleLogout}>{nav.name}</Nav.Link>
        )
    } else {
        return (
            <Nav.Link style={{color: "white"}} href={nav.href}>{nav.name}</Nav.Link>
        )
    }
    
}

export default NavItem