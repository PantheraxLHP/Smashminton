export class ServiceResponse {
    static success(data: any, message = 'Success') {
        return {
            ok: true,
            data,
            message,
        };
    }

    static created(data: any, message = 'Created') {
        return {
            ok: true,
            data,
            message,
        };
    }

    static error(message = 'Internal Server Error') {
        return {
            ok: false,
            data: [],
            message,
        };
    }
    static badRequest(message = 'Bad Request') {
        return {
            ok: false,
            data: [],
            message,
        };
    }
    static unauthorized(message = 'Unauthorized') {
        return {
            ok: false,
            data: [],
            message,
        };
    }
    static forbidden(message = 'Forbidden') {
        return {
            ok: false,
            data: [],
            message,
        };
    }
    static notFound(message = 'Not Found') {
        return {
            ok: false,
            data: [],
            message,
        };
    }
    static noContent() {
        return {
            ok: true,
            data: [],
            message: 'No Content',
        };
    }
}
