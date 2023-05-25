// File: constants.js

// Errors - Accommodations
const accommodationNotFound = "Accommodation Not Found";
const accommodationAlreadyExists = "Accommodation Already Exists";
const accommodationCreationFailed = "Accommodation Creation Failed";

// Errors - Owners
const ownerNotFound = "Owner Not Found";
const ownerIdInvalid = "Owner Id Invalid";

// Errors - Reviews
const reviewNotFound = "Review Not Found";
const noReviewsFound = "No reviews found";

// Errors - Servers
const serverError = "Server Error";

// Errors - Objects
const objectIdInvalid = "Object Id Invalid";

// Miscellaneous Errors
const invalidAccommodationOwner = "Invalid Accommodation/owner";
const fieldsMissing = "All fields must be provided";

// Messages - Accommodations
const accommodationCreated = "Accommodation Created";
const accommodationDeleted = "Accommodation Deleted";
const accommodationArchived = "Accommodation Archived Successfully";

// Messages - Reviews
const reviewDeleted = "Review Deleted Successfully";

module.exports = {
  // Errors - Accommodations
  accommodationNotFound,
  accommodationAlreadyExists,
  accommodationCreationFailed,
  // Errors - Owners
  ownerNotFound,
  ownerIdInvalid,
  // Errors - Reviews
  reviewNotFound,
  noReviewsFound,
  // Errors - Servers
  serverError,
  // Errors - Objects
  objectIdInvalid,
  // Miscellaneous Errors
  invalidAccommodationOwner,
  fieldsMissing,
  // Messages - Accommodations
  accommodationCreated,
  accommodationDeleted,
  accommodationArchived,
  // Messages - Reviews
  reviewDeleted
};
