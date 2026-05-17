
export interface AppErrorOptions {
    domain?: string
    traceId?: string
}


export class AppError extends Error {
    
    domain?: string = 'not-set'
    traceId?: string
    stack?: string


    constructor(msg?: string, options?: ErrorOptions & AppErrorOptions){
        super(msg,options)
        this.domain = options?.domain
        this.traceId = options?.traceId

        if (process.env.CAPTURE_STACKTRACE === 'true') {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export class NotFoundError extends AppError {}
export class UnavailableError extends AppError {}

export class UnauthorizedError extends AppError {}
export class UnauthenticatedError extends AppError {}

