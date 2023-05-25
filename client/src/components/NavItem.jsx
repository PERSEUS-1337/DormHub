import React from 'react'
import { Nav } from 'react-bootstrap'
import { FaHeart } from 'react-icons/fa'

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
            // <Nav.Link style={{color: "white"}} href={nav.href}>{nav.name}</Nav.Link>
            <Nav.Link style={{ color: "white" }} href={ nav.href }>
                    <label className='d-flex align-items-center' style={{cursor: "pointer"}}>
                        { nav.icon }   
                        <p className='mx-2'>{ nav.name }</p>   
                    </label>
            </Nav.Link>
        )
    }

}

export default NavItem