const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

/*
  Example usage:

  - SUCCESS (200):
    - When fetching data from the server was successful.
    - When a request was processed successfully, and there are no errors.
    - When an update operation was successful.

  - CREATED (201):
    - When a new user is successfully registered.
    - When a new post or resource is created.
  
  - BAD_REQUEST (400):
    - When the client sends a malformed request.
    - When required request parameters are missing or invalid.
  
  - UNAUTHORIZED (401):
    - When a user tries to access a protected resource without proper authentication.
    - When the provided credentials (e.g., API key, token) are invalid.

  - FORBIDDEN (403):
    - When a user tries to access a resource they don't have permission to view or modify.

  - NOT_FOUND (404):
    - When the requested resource or endpoint does not exist on the server.

  - CONFLICT (409):
    - When there is a conflict with the current state of the server, such as duplicate data.
    - For example, when attempting to create a resource with a unique constraint that already exists.

  - SERVER_ERROR (500):
    - When an unexpected server error occurred during request processing.
    - Should be used for unhandled exceptions or internal server errors.
*/

module.exports = STATUS_CODES;
