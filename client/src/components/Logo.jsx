import React from 'react';
import ReactDOM from 'react-dom';

const DormHubLogo = () => {
    const logo = process.env.PUBLIC_URL + '/dormhub_logo.png'
    return(
        <img src={logo} alt="" srcSet="" width={110} height={46}/>
    );
};

export default DormHubLogo;