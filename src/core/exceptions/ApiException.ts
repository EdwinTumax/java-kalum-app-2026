
export class ApiException extends Error {
    public readonly statusCode?: number;
    public readonly errors?: string[];

    constructor(message: string, statusCode?: number, errors?: string[]) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        this.errors = errors;
    }
}