import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import './ScrollTopBtn.css';

const ScrollToTopButton = () => {
    const [showButton, setShowButton] = useState(false);
  
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowButton(scrollTop > 250);
    };
  
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };
    window.addEventListener('scroll', handleScroll);
  
    return (
      <Button
        className={`scroll-to-top-button ${showButton ? 'show' : 'hide'}`}
        onClick={scrollToTop}
        variant="primary"
      >
        Scroll to Top
      </Button>
    );
  };
  
  export default ScrollToTopButton;