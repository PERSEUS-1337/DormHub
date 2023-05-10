import React, { useState } from 'react'
import { Alert, Button } from 'react-bootstrap'


const FavoriteAlert = () => {
    const [show, setShow] = useState(true);
    return (
        <>
            <Alert show={show} variant='danger'>
                <Alert.Heading>OOps... You're not logged in!</Alert.Heading>
                <p>You must have an account to view your favorites.</p>
                <hr />
                <div className="d-flex-justify-content-end">
                    <Button onClick={() => setShow(false)} variant='danger'>Login</Button>
                </div>
            </Alert>
        </>
    )
}

export default FavoriteAlert
