import dotenv from "dotenv";

class EnvironmentWrapper {
    private port?: number;
    private host?: string;

    private jwtSecret?: string;
    private jwtExpiration?: number;
    private jwtRefreshTokenExpiration?: number;

    private connectionString?: string;

    private corsOrigins?: string[];

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

    private readStrArray(key: string): string[] {
        const readed = this.readStrValue(key);
        const result = JSON.parse(readed);
        if (Array.isArray(result)) {
            return result;
        }
        throw new Error(`[EnvironmentWrapper] Parsing failed. Expecting Json array format for key: "${key}"`);
    }

    public get Port(): number {
        if (!this.port) {
            this.port = this.readIntValue("G_PORT");
        }
        return this.port;
    }

    public get Host(): string {
        if (!this.host) {
            this.host = this.readStrValue("G_HOST");
        }
        return this.host;
    }

    public get JwtSecret(): string {
        if (!this.jwtSecret) {
            this.jwtSecret = this.readStrValue("G_JWT_SECRET");
        }
        return this.jwtSecret;
    }

    public get JwtExpiration(): number {
        if (!this.jwtExpiration) {
            this.jwtExpiration = this.readIntValue("G_JWT_EXPIRATION");
        }
        return this.jwtExpiration;
    }

    public get JwtRefreshExpiration(): number {
        if (!this.jwtRefreshTokenExpiration) {
            this.jwtRefreshTokenExpiration = this.readIntValue("G_REFRESH_TOKEN_EXPIRATION");
        }
        return this.jwtRefreshTokenExpiration;
    }

    public get ConnectionString(): string {
        if (!this.connectionString) {
            this.connectionString = this.readStrValue("G_CONNECTION_STRING");
        }
        return this.connectionString;
    }

    public get CorsOrigins(): string[] {
        if (!this.corsOrigins) {
            this.corsOrigins = this.readStrArray("G_ORIGIN");
        }
        return this.corsOrigins;
    }

    public get Runtime(): string | undefined {
        return process.env.NODE_ENV;
    }
}

export {EnvironmentWrapper};
