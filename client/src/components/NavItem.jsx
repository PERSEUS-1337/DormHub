import React from 'react'
import { Nav } from 'react-bootstrap'

const NavItem = ({ nav }) => {
    return (
        <Nav.Link style={{color: "white"}} href={nav.href}>{nav.name}</Nav.Link>
    )
}

export default NavItem