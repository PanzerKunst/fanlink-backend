type HttpStatusCode = {
  OK: number;
  NO_CONTENT: number;
  BAD_REQUEST: number,
  UNAUTHORIZED: number;
  FORBIDDEN: number;
  INTERNAL_SERVER_ERROR: number;
}

export const httpStatusCode: HttpStatusCode = {
  OK: 200,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500
}
