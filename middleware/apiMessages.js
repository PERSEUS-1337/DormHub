module.exports = {
    //	Accommodations
    ACCOMMODATION_NOT_FOUND: "Accommodation does not exist.",
    ACCOMMODATION_ALREADY_EXISTS: "Accommodation already exists.",
    ACCOMMODATION_CREATION_FAILED: "Accommodation creation failed.",
    ACCOMMODATION_ID_INVALID: "Accommodation ID invalid.",
    ACCOMMODATION_ARCHIVED: "Accommodation archived.",

    //	Owners
    OWNER_NOT_FOUND: "Owner does not exist.",
    OWNER_ID_INVALID: "Owner ID invalid.",
    OWNER_ALREADY_EXISTS: "Owner already exists.",

    // Users
    USER_NOT_FOUND: "User does not exist.",
    INCORRECT_PASSWORD: "Incorrect Password",
    USER_ID_INVALID: "User ID invalid",
    USER_ALREADY_EXISTS: "User already exists",
    USER_NOT_SAVED: "User not saved",

    //	Reviews
    REVIEW_NOT_FOUND: "Review does not exist.",
    NO_REVIEWS_FOUND: "There are currently no reviews.",

    //	Servers
    INTERNAL_ERROR: "The request failed due to an internal error.",

    // Objects
    OBJECT_ID_INVALID: "Object ID invalid.",
    NO_FILES_UPLOADED: "No files uploaded.",
    
    //Miscellaneous
    MISMATCHED_PASS: "Mismatched new password",
    INVALID_PRICE: "Invalid price",
    EMPTY_FIELD: "Empty characters",
    EMPTY_ARRAY: "Empty array",
    INVALID_PHONE: "Invalid phone number",
    INVALID_ACCOMMODATION_OWNER: "Invalid accommodation owner.",
    FIELDS_MISSING: "All fields must be provided.",
    BOOKMARKS_NOT_FOUND: "There are no bookmarks.",
    BOOKMARK_ALREADY_EXISTS: "Bookmark already exists.",
    NOT_IN_BOOKMARK: "Accommodation is not in bookmarks!",
    OWNER_NOT_IN_BOOKMARK: "Owner is not in bookmarks!",
    USER_NOT_IN_BOOKMARK: "User is not in bookmarks!",
    FIELDS_NOT_PROVIDED: "All fields must be provided.",
    INVALID_EMAIL: "Invalid email.",
    WEAK_PASSWORD: 'Password should be of length 8 or more and must contain an uppercase letter, a lowercase letter, a digit, and a symbol.',
    BAD_REQUEST: "The request is invalid or improperly formed. Consequently, the server could not understand the request.",
    UNAUTHORIZED_REQUEST: "Unauthorized request!",
    ROUTE_NOT_FOUND: "Route does not exist.",
    REQ_BODY_EMPTY: "The req.body is empty!",

    //accommodation controller
    GET_ACCOMMODATION_ERROR: "getAccommodation error",
    GET_ACCOMMODATION_BY_ID_ERROR: "getAccommodationById error",
    CREATE_ACCOMMODATION_ERROR: "createAccommodation error",
    UPDATE_ACCOMMODATION_ERROR: "updateAccommodation error",
    DELETE_ACCOMMODATION_ERROR: "deleteAccommodation error",
    ARCHIVE_ACCOMMODATION_ERROR: "archiveAccommodation error",
    GET_ACCOMMODATION_REVIEW_ERROR: "getAccommodationReview error",
    GET_ACCOMMODATION_REVIEW_BY_USER_ID_ERROR: "getAccommodationByUserId error",
    POST_REVIEW_ACCOMMODATION_ERROR: "postReviewAccommodation error",
    DELETE_REVIEW_ACCOMMODATION_ERROR: "deleteReviewAccommodation error",
    UPLOAD_PICS_ERROR: "uploadPics error",
    GET_PICS_ERROR: "getPics error",

    //user controller
    REGISTER_ERROR: "Register error",
    LOGIN_ERROR: "Login error",
    GET_ALL_USERS_ERROR: "getAllUsers error",
    GET_ALL_OWNERS_ERROR: "getAllOwners error",
    EDIT_USER_DATA_ERROR: "editUserData error",
    GET_USER_DATA_ERROR: "getUserData error",
    GET_BOOKMARK_ERROR: "getBookmark error",
    ADD_TO_BOOKMARK_ERROR: "addToBookmark error",
    DELETE_BOOKMARK_ERROR: "deleteBookmark error",
    FAILED_TO_UPLOAD_PICTURE: "Failed to upload picture",
    NO_PICTURE_PROVIDED: "No picture provided",
    UPLOAD_PFP_ERROR: "uploadPfp error",
    GET_PFP_ERROR: "getPfp error",
    NOT_AN_OWNER: "Not an owner",
    GET_ACCOMMODATION_OWNER_ERROR: "getAccommodationOwner error",
    RESET_PASSWORD_ERROR: "password reset error",

    //Messages
    //	Accommodations
    ACCOMMODATION_CREATED: "Accommodation created.",
    ACCOMMODATION_DELETED: "Accommodation deleted.",
    ACCOMMODATION_ARCHIVED: "Accommodation archived successfully!",
    ACCOMMODATION_UPDATED: "Accommodation updated successfully!",

    // Reviews
    REVIEW_DELETED: "Review deleted successfully!",

    //	Miscellaneous
    LOGIN_SUCCESSFUL: "Logged in successfully!",
    BOOKMARK_SUCCESSFUL: "Accommodation added to bookmarks!",
    BOOKMARK_REMOVE_SUCCESSFUL: "Accommodation removed from bookmarks!",
    EDITED_SUCCESSFULLY: "Edited successfully!",
    FETCH_SUCCESSFUL: "Fetch successful",
    CREATE_SUCCESSFUL: "Create successful",
    RESET_PASSWORD_SUCCESSFUL: "Password reset successful",

    //accommodation controller
    GET_ACCOMMODATION_SUCCESS: "getAccommodation successful",
    GET_ACCOMMODATION_BY_ID_SUCCESS: "getAccommodationById successful",
    CREATE_ACCOMMODATION_SUCCESS: "createAccommodation successful",
    UPDATE_ACCOMMODATION_SUCCESS: "updateAccommodation successful",
    DELETE_ACCOMMODATION_SUCCESS: "deleteAccommodation successful",
    ARCHIVE_ACCOMMODATION_SUCCESS: "archiveAccommodation successful",
    GET_ACCOMMODATION_REVIEW_SUCCESS: "getAccommodationReview successful",
    GET_ACCOMMODATION_REVIEW_BY_USER_ID_SUCCESS: "getAccommodationReviewByUserId successful",
    POST_REVIEW_ACCOMMODATION_SUCCESS: "postReviewAccommodation successful",
    DELETE_REVIEW_ACCOMMODATION_SUCCESS: "deleteReviewAccommodation successful",
    UPLOAD_PICS_SUCCESS: "uploadPics successful",
    GET_PICS_SUCCESS: "getPics successful",

    //user controller
    REGISTER_SUCCESS: "register successful",
    GET_ALL_USERS_SUCCESSFUL: "getAllUsers successful",
    GET_ALL_OWNERS_SUCCESSFUL: "getAllOwners successful",
    EDIT_USER_DATA_SUCCESSFUL: "Data edited successfully",
    GET_USER_DATA_SUCCESSFUL: "getUserData successful",
    GET_BOOKMARK_SUCCESSFUL: "getBookmark successful",
    UPLOAD_PFP_SUCCESSFUL: "uploadPfp successful",
    GET_PFP_SUCCESSFUL: "getPfp successful",
    GET_ACCOMMODATION_OWNER_SUCCESSFUL: "getAccommodationOwner successful",
}