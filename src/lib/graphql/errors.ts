import { GraphQLError, GraphQLErrorOptions } from "graphql";
import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError as ServiceNotFoundError,
  ConflictError,
  BadRequestError,
} from "@/lib/services/errors";

export interface AppErrorExtensions {
  code: string;
  statusCode: number;
}

export class GraphQLAppError extends GraphQLError {
  constructor(
    msg: string,
    appExtensions: AppErrorExtensions,
    options?: GraphQLErrorOptions,
  ) {
    const modified = options ?? {};
    const extensions = modified.extensions ?? {};
    modified.extensions = { ...appExtensions, ...extensions };

    super(msg, modified);
  }
}

export class NotFoundError extends GraphQLAppError {
  constructor(msg: string, options?: GraphQLErrorOptions) {
    super(msg, { code: "NOT_FOUND", statusCode: 404 }, options);
  }
}

export class UnavailableError extends GraphQLAppError {
  constructor(msg: string, options?: GraphQLErrorOptions) {
    super(msg, { code: "SERVICE_UNAVAILABLE", statusCode: 503 }, options);
  }
}

export class UnauthorizedError extends GraphQLAppError {
  constructor(msg: string, options?: GraphQLErrorOptions) {
    super(msg, { code: "UNAUTHORIZED", statusCode: 401 }, options);
  }
}

export class ConflictAppError extends GraphQLAppError {
  constructor(msg: string, options?: GraphQLErrorOptions) {
    super(msg, { code: "CONFLICT", statusCode: 409 }, options);
  }
}

export class BadRequestAppError extends GraphQLAppError {
  constructor(msg: string, options?: GraphQLErrorOptions) {
    super(msg, { code: "BAD_REQUEST", statusCode: 400 }, options);
  }
}

export function toGraphQLError(err: Error): GraphQLError {
  if (err instanceof GraphQLError) return err;

  if (err instanceof AuthenticationError || err instanceof AuthorizationError)
    return new UnauthorizedError(err.message);
  if (err instanceof ServiceNotFoundError)
    return new NotFoundError(err.message);
  if (err instanceof ConflictError) return new ConflictAppError(err.message);
  if (err instanceof BadRequestError)
    return new BadRequestAppError(err.message);

  return new GraphQLAppError(err.message, {
    code: "INTERNAL_SERVER_ERROR",
    statusCode: 500,
  });
}
