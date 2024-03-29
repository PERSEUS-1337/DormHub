import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Pagination } from 'react-bootstrap'
import { ReadStarRating } from './StarRating'

import '../pages/accom-style.css';
import { FaDraft2Digital } from 'react-icons/fa';
import './review.css';

const ReviewTileItem = ({ data }) => {
    const [user, setUser] = useState(""); // Define state variable
    const jwt = localStorage.getItem("token");


    try {
        useEffect(() => {
            fetch(`/api/v1/auth-required-func/${data.user}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${jwt}`
                },
            })
                .then(res => res.json())
                .then(data1 => {
                    setUser(data1.fname + " " + data1.lname)
                });
        }, []);
    }
    catch {
        console.log("Error")
    }

    const dateTime = new Date(data.createdAt)

    const date = dateTime.toLocaleDateString(); // Get the date portion
    const time = dateTime.toLocaleTimeString(); // Get the time portion

    // console.log("data rating" + data.rating)
    return (
        // <Container className='d-flex justify-content-center'>
        <div className='border rounded border-1 border-primary reviewTile'>
            <Row>
                <Col lg={4}>
                    <p className='text-center fw-bold mt-4 reviewTopName'>{data.fname}</p>
                </Col>
                <Col lg={8}>
                    <ReadStarRating rate={data} />


                </Col>
            </Row>
            <div className='reviewDetail overflow-auto mb-3'>
                <p className=''>{data.detail}</p>
            </div>
            <div className='text-center'>
                <h6 className='fw-bold'>{data.fname} {data.lname}</h6>
                {/* <h6><b>{data.fname} {data.lname}</b></h6> */}
                <p>{date}, {time}</p>
            </div>

            {/* </Col> */}
            {/* </Row> */}
        </div>
    )
}


const ReviewList = ({ data }) => {
    // console.log(data.review)
    const [reviewData, setreviewData] = useState(data.review);
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6
    const maxVisiblePages = 5


    const ReviewList = reviewData && reviewData.map(data => <ReviewTileItem key={data} data={data} />)
    const indexLastItem = currentPage * itemsPerPage
    const indexFirstItem = indexLastItem - itemsPerPage
    const currentItems = reviewData.slice(indexFirstItem, indexLastItem)

    const totalPages = Math.ceil(reviewData.length / itemsPerPage)

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const renderPageNumbers = () => {
        const pageNumbers = []
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
        let endPage = Math.min(totalPages, startPage + maxVisiblePages -1)

        if (endPage - startPage < maxVisiblePages -1){
            startPage = Math.max(1, endPage - maxVisiblePages + 1)
        }

        for (let i = startPage; i <= endPage; i++){
            pageNumbers.push(
                <Pagination.Item
                    key={i}
                    active={i === currentPage}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </Pagination.Item>
            )
        }

        return pageNumbers;
    }

    return (
        <>

            <Row>
                {
                    currentItems.map((data) => {
                        return (
                            <>
                                <Col lg={4}>
                                    <Container className=' align-items-center m-auto mt-4 pb-2'>
                                        <ReviewTileItem key={data} data={data} />
                                    </Container>
                                </Col>
                            </>
                        )
                    })
                }
            </Row>

            {/* <Pagination className='mt-3 text-center flex-column align-items-center'>{items}</Pagination> */}
            <Pagination className='d-flex justify-content-center'>
                    <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={handlePreviousPage} disabled={currentPage === 1} />

                    {renderPageNumbers()}

                    <Pagination.Next onClick={handleNextPage} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>

        </>
    )

}



export default ReviewList