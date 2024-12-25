const ResponseConstants = {
  Common: {
    200: {
      code: 'RESPONSE_SUCCESS',
      message: 'Request served successfully.',
    },
    400: {
      code: 'BAD_REQUEST',
      message:
        'The request could not be understood by the server due to malformed syntax.',
    },
    401: {
      code: 'UNAUTHORIZED',
      message: 'This user is not authorized to perform this action.',
    },
    403: {
      code: 'Forbidden',
      message: 'Permission denied: invalid app secret :) ',
    },
    404: {
      code: 'NOT_FOUND',
      message: 'Could not find the requested resource.',
    },
    409: {
      code: 'CONFLICT',
      message: 'This resource already exists in the system.',
    },
    500: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Oops, Something went wrong!',
    },
  },
  STATUS: {
    STATUS_NOT_FOUND: {
      code: 'STATUS_NOT_FOUND',
      message: 'Oops, could not find the status!',
    },
    FAILED_TO_UPDATE_STATUS: {
      code: 'FAILED_TO_UPDATE_STATUS',
      message: 'Oops, could not update the status!',
    },
  },
};

export default ResponseConstants;
