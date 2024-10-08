import { JwtPayload, sign, TokenExpiredError, verify } from "jsonwebtoken";
import { AuthorizationError } from "./error";
import { UserEntity } from "../database/user";
import md5 from "md5";
import { getSetting } from "../models/settings";

const setting = getSetting();

export interface TokenPayload extends JwtPayload {
    role: string,
    email: string,
}

export function validatePassword(user: UserEntity | undefined, password: string): boolean {
    return md5(password).toUpperCase() === user?.Password;
}

export function issueToken(user: { email: string, role: string }) {
    const token: string = sign({
        email: user.email,
        role: user.role || 'User'
    }, setting.token.secret, {
        expiresIn: `${setting.token.expiresInHour}h`,
        algorithm:  'HS256',
        audience: setting.token.audience,
        issuer: setting.token.issuer,    
    })
    return {
        'email': user.email,
        'value': token,
        'refreshToken': 'xxx',
        'issueAt': 'xxx',
        'expireInHours': Number(setting.token.expiresInHour)
    };
}

export function getTokenPayload(token: string | undefined): TokenPayload | undefined {
    if (!token || token.trim() === '') {
        throw new AuthorizationError({ code: '999', message: 'empty token'});
    }

    if (token.trim().split(' ').length === 1) {
        throw new AuthorizationError({ code: '999', message: 'invalid token pattern'});
    }

    if (token.trim().split(' ').length === 1) {
        throw new AuthorizationError({ code: '999', message: 'invalid token pattern'});
    }

    try {
        const _token = token?.trim().split(' ')[1];
        const p = verify(_token, setting.token.secret, {
            algorithms: ['HS256'],
            audience: setting.token.audience,
            issuer: setting.token.issuer
        })
    
        const payload = p as TokenPayload;
        console.log(payload.email);
        return payload;        
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            throw new AuthorizationError({ code: '999', message: "token expires"});
        }
    }
}