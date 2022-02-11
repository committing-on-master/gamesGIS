import dotenv from "dotenv";

class EnvironmentWrapper {
    private port?: number;
    private host?: string;

    private jwtSecret?: string;
    private jwtExpiration?: number;
    private jwtRefreshTokenExpiration?: number;

    private connectionString?: string;

    constructor() {
        const dotenvResult = dotenv.config();
        if (dotenvResult.error) {
            throw dotenvResult.error;
        }
    }

    private readStrValue(key: string): string {
        const result = process.env[key];
        if (result) {
            return result;
        }
        throw new Error(`[EnvironmentWrapper] Cannot read environment variable by key: "${key}"`);
    }

    private readIntValue(key: string): number {
        const readed = this.readStrValue(key);
        const parsed = Number.parseInt(readed, 10);
        if (Number.isInteger(parsed)) {
            return parsed;
        }
        throw new Error(`[EnvironmentWrapper] Parsing failed. Expecting int format for key: "${key}"`);
    }

    private readFloatValue(key: string): number {
        const readed = this.readStrValue(key);
        const parsed = Number.parseFloat(readed);
        if (Number.isNaN(parsed)) {
            throw new Error(`[EnvironmentWrapper] Parsing failed. Expecting float format for key: "${key}"`);
        }
        return parsed;
    }

    public get Port(): number {
        if (!this.port) {
            this.port = this.readIntValue("PORT");
        }
        return this.port;
    }

    public get Host(): string {
        if (!this.host) {
            this.host = this.readStrValue("HOST");
        }
        return this.host;
    }

    public get JwtSecret(): string {
        if (!this.jwtSecret) {
            this.jwtSecret = this.readStrValue("JWT_SECRET");
        }
        return this.jwtSecret;
    }

    public get JwtExpiration(): number {
        if (!this.jwtExpiration) {
            this.jwtExpiration = this.readIntValue("JWT_EXPIRATION");
        }
        return this.jwtExpiration;
    }

    public get JwtRefreshExpiration(): number {
        if (!this.jwtRefreshTokenExpiration) {
            this.jwtRefreshTokenExpiration = this.readIntValue("REFRESH_TOKEN_EXPIRATION");
        }
        return this.jwtRefreshTokenExpiration;
    }

    public get ConnectionString(): string {
        if (!this.connectionString) {
            this.connectionString = this.readStrValue("CONNECTION_STRING");
        }
        return this.connectionString;
    }
}

export {EnvironmentWrapper};
