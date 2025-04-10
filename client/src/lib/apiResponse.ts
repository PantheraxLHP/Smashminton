import { NextResponse } from 'next/server';

export class ApiResponse {
    static success(data: any = null, message = 'Success') {
        return NextResponse.json({ message, data }, { status: HttpStatus.OK });
    }

    static created(data: any = null, message = 'Created') {
        return NextResponse.json({ message, data }, { status: HttpStatus.CREATED });
    }

    static noContent() {
        return NextResponse.json({}, { status: HttpStatus.NO_CONTENT });
    }

    static badRequest(message = HttpMessages[HttpStatus.BAD_REQUEST]) {
        return NextResponse.json({ message }, { status: HttpStatus.BAD_REQUEST });
    }

    static unauthorized(message = HttpMessages[HttpStatus.UNAUTHORIZED]) {
        return NextResponse.json({ message }, { status: HttpStatus.UNAUTHORIZED });
    }

    static forbidden(message = HttpMessages[HttpStatus.FORBIDDEN]) {
        return NextResponse.json({ message }, { status: HttpStatus.FORBIDDEN });
    }

    static notFound(message = HttpMessages[HttpStatus.NOT_FOUND]) {
        return NextResponse.json({ message }, { status: HttpStatus.NOT_FOUND });
    }

    static conflict(message = HttpMessages[HttpStatus.CONFLICT]) {
        return NextResponse.json({ message }, { status: HttpStatus.CONFLICT });
    }

    static error(message = HttpMessages[HttpStatus.INTERNAL_SERVER_ERROR]) {
        return NextResponse.json({ message }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}

const HttpStatus = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
} as const;

const HttpMessages = {
    [HttpStatus.BAD_REQUEST]: 'Bad Request',
    [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
    [HttpStatus.FORBIDDEN]: 'Forbidden',
    [HttpStatus.NOT_FOUND]: 'Not Found',
    [HttpStatus.CONFLICT]: 'Conflict occurred',
    [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
};
