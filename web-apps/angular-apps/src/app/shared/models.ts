import { UserRole } from '@phantom-chen/cloud77';

export interface TokenValidationResult extends UserRole {
    expiration: string;
}

export interface LoginResult {
    status: LoginStatus;
    message?: string;
    token?: string;
}

export enum LoginStatus {
    error = 0,
    success = 1
}

// export interface IGatewayService {
//     getSite(): Promise<string>;
//     getUser(email: string, name: string): Promise<UserEmail>;
//     createUser(
//         email: string,
//         name: string,
//         password: string
//     ): Promise<DefaultResponse>;
//     confirmEmail(email: string, token: string): Promise<DefaultResponse>;
//     generateToken(email: string, password: string): Promise<UserToken>;
//     validateToken(): Promise<string>;
// }