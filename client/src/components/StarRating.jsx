import React, { useState } from 'react'
import { FaStar } from 'react-icons/fa'

const StarRating = ({ rating, setRating }) => {
    const [hover, setHover] = useState(null)


    return (
        <div className='d-flex align-items-center'>
            {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1
                
                return (
                    <label key={index}>
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


const ReadStarRating = (data) => {
    // console.log("RATING READ STAR RATING", data.rate.rating)
    const rating = data.rate.rating

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
                        />
                        <FaStar
                            size={20}
                            color={ratingValue <= (rating) ? "#ffc107" : "#b8bac2"}
                        /> 
                    </label>
                    
                )
            })}
            {/* will remove this line later. this is just for testing */}
            <p className='ms-2 fs-4'>{rating}/5</p> 
            
        </div>
    )
}

const AccomStarRating = (data) => {
    // console.log("RATING READ STAR RATING", data.rate.rating)
    const rating = data.rate
    console.log("Rating, " ,rating)

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
                        />
                        <FaStar
                            size={20}
                            color={ratingValue <= (rating) ? "#ffc107" : "#b8bac2"}
                        /> 
                    </label>
                    
                )
            })}
            {/* will remove this line later. this is just for testing */}
            <p className='ms-2 fs-4'>{rating}/5</p> 
            
        </div>
    )
}

export {StarRating, ReadStarRating, AccomStarRating}