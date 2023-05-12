import React, { useState } from 'react'
import { FaStar } from 'react-icons/fa'

const StarRating = () => {
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(null)


    return (
        <div className='d-flex align-items-center'>
            {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1
                
                return (
                    <label>
                        <input
                            type="radio"
                            name="rating"
                            className='d-none'
                            value={ratingValue}
                            onClick={() => setRating(ratingValue)}
                        />
                        <FaStar
                            size={40}
                            color={ratingValue <= (hover || rating) ? "#ffc107" : "#b8bac2"}
                            style={{ cursor: 'pointer' }}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(null)}
                        /> 
                    </label>
                    
                )
            })}
            {/* will remove this line later. this is just for testing */}
            <p className='ms-2 fs-4'>{rating}</p> 
            
        </div>
    )
}

export default StarRating