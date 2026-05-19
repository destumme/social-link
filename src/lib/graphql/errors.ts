import { GraphQLError, GraphQLErrorOptions } from "graphql";

export interface AppErrorExtensions {
  code: string;
  statusCode: number;
}

export class GraphqlAppError extends GraphQLError {
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

export class NotFoundError extends GraphqlAppError {
  constructor(msg: string, options?: GraphQLErrorOptions) {
    super(msg, { code: "NOT_FOUND", statusCode: 404 }, options);
  }
}

export class UnavailableError extends GraphqlAppError {
  constructor(msg: string, options?: GraphQLErrorOptions) {
    super(msg, { code: "SERVICE_UNAVAILABLE", statusCode: 503 }, options);
  }
}

export class UnauthorizedError extends GraphqlAppError {
  constructor(msg: string, options?: GraphQLErrorOptions) {
    super(msg, { code: "UNAUTHORIZED", statusCode: 401 }, options);
  }
}
