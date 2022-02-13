import crypto from "crypto";
import jwt from "jsonwebtoken";
import argon2 from "argon2";

import {JwtPayload} from "src/controllers/common-types/jwt.payload";

abstract class CryptoHelper {
    static async getHash(str:string) {
        return await argon2.hash(str);
    }

    static getTokens(jwtPayload: JwtPayload,
        email: string,
        jwtSecret: string,
        tokenExpirationInSeconds: number): {accessToken: string, refreshToken: string} {
        const salt = crypto.createSecretKey(crypto.randomBytes(16));
        const refreshToken = crypto.createHmac("sha512", salt)
            .update(email)
            .digest("base64");
        const token = jwt.sign(jwtPayload, jwtSecret, {expiresIn: tokenExpirationInSeconds});
        return {accessToken: token, refreshToken: refreshToken};
    }
}

export {CryptoHelper};
