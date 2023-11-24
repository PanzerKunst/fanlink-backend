type HttpStatusCode = {
  readonly OK: number;
  readonly NO_CONTENT: number;
  readonly BAD_REQUEST: number,
  readonly UNAUTHORIZED: number;
  readonly FORBIDDEN: number;
  readonly INTERNAL_SERVER_ERROR: number;
}

export const httpStatusCode: HttpStatusCode = {
  OK: 200,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500
}
