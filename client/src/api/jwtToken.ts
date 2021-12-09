/* eslint-disable getter-return */
import jwtDecode from "jwt-decode";

interface Token {
    userId: number,
    userName: string,
    permissionFlag: number,
    iat: number,
    // дата протухания токена, UTC, время указано в секундах 
    exp: number
}

class JwtToken {
    // Закроем глаза, и представить что мы тут храним все секурно. Тестовый проект как никак
    public accessToken?: string;
    private refreshToken?: string;
    private key: string = "jwtToken";
    private payload?: Token;

    
    public get Payload() : Token | undefined {
        return this.payload;
    }    

    /**Оставшееся время жизни токена в миллисекундах */
    public get ExpirationTimeout(): number | undefined {
        if (!this.payload) {
            return undefined;
        }
        const result = this.payload.exp * 1000 - Date.now(); // Date.now() - миллисекунды по UTC
        return (result > 0) ? result : 0;
    }


    public set Access(token: string | undefined) {
        if (!token) {
            this.accessToken = undefined;
            this.payload = undefined;
            return;
        }
        this.accessToken = token;
        this.payload = jwtDecode<Token>(token);
    }

    public get Access(): string | undefined {
        return this.accessToken;
    }

    public set Refresh(token: string | undefined) {
        this.refreshToken = token;
        if (token) {
            localStorage.setItem(this.key, token);
        } else {
            localStorage.removeItem(this.key);
        }
    }

    public get Refresh(): string | undefined {
        if (!this.refreshToken) {
            const saved = localStorage.getItem(this.key);
            return saved ? saved : undefined;
        }
        if (this.refreshToken) {
            return this.refreshToken;
        }
    }
}

export { JwtToken };