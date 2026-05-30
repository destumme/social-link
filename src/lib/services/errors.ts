export class ServiceError extends Error {
  name = "ServiceError";
}

export class AuthenticationError extends ServiceError {
  name = "AuthenticationError";
}

export class AuthorizationError extends ServiceError {
  name = "AuthorizationError";
}

export class NotFoundError extends ServiceError {
  name = "NotFoundError";
}

export class ConflictError extends ServiceError {
  name = "ConflictError";
}

export class BadRequestError extends ServiceError {
  name = "BadRequestError";
}
