export class AuthorizationError extends Error {
    constructor(params: { code: string, message: string }) {
        super();
        this.code = params.code;
        this.message = params.message;
    }

    public code = ''; 
}

export interface ServiceResponse {
    code: string,
    id: string,
    message: string
}