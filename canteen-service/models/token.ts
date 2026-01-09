import { JwtPayload, sign, TokenExpiredError, verify } from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
    role: string,
    email: string,
}

export class AuthorizationError extends Error {
    constructor(params: { code: string, message: string }) {
        super();
        this.code = params.code;
        this.message = params.message;
    }

    public code = ''; 
}

const secret = 'abcdefghijklmnopqrstuvwzxyabcdefgh';

export function issueToken(user: { email: string, role: string }) {
    const expiresInHour = 24;
    const token: string = sign({
        email: user.email,
        role: user.role || 'User'
    }, secret, {
        expiresIn: `${expiresInHour}h`,
        algorithm: 'HS256',
        audience: 'audience',
        issuer: 'issuer',
    })
    return {
        'email': user.email,
        'value': token,
        'refreshToken': 'xxx',
        'issueAt': 'xxx',
        'expireInHours': Number(expiresInHour)
    };
}

export function getClaims(token: string): string | undefined {
    try {
        if (!token || token.trim() === '') {
            throw new AuthorizationError({ code: '999', message: 'empty token' });
        }
        const p = verify(token, secret, {
            algorithms: ['HS256'],
            audience: 'audience',
            issuer: 'issuer'
        })
        console.log(p);

        const payload = p as TokenPayload;
        console.log(payload.email);

        return payload.email;
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            throw new AuthorizationError({ code: '999', message: "token expires" });
        }
    }
}