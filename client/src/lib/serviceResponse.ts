export class ServiceResponse {
    static success<T>(data: T = null as T, message = 'Success') {
        return {
            ok: true,
            data,
            message,
        };
    }

    static created<T>(data: T = null as T, message = 'Created') {
        return {
            ok: true,
            data,
            message,
        };
    }

    static error(message = 'Internal Server Error') {
        return {
            ok: false,
            message,
        };
    }

    static badRequest(message = 'Bad Request') {
        return {
            ok: false,
            message,
        };
    }

    static unauthorized(message = 'Unauthorized') {
        return {
            ok: false,
            message,
        };
    }

    static forbidden(message = 'Forbidden') {
        return {
            ok: false,
            message,
        };
    }

    static notFound(message = 'Not Found') {
        return {
            ok: false,
            message,
        };
    }
}
