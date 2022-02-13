class EndPoints {
    public static get Host(): string {
        const host = process.env.REACT_APP_HOSTING;
        if (host && host !== "") {
            return host;
        }
        throw new Error("Environment variable REACT_APP_HOSTING is not set");
    }

    public static get Tiles(): string {
        const tiles = process.env.REACT_APP_TILES_URL;
        if (tiles && tiles !== "") {
            return tiles;
        }
        throw new Error("Environment variable REACT_APP_TILES_URL is not set");
    }

    public static get Api(): string {
        const api = process.env.REACT_APP_API_URL;
        if (api && api !== "") {
            return api;
        }
        throw new Error("Environment variable REACT_APP_API_URL is not set");
    }

    public static get Gallery(): string {
        const api = process.env.REACT_APP_AREA_IMAGES;
        if (api && api !== "") {
            return api;
        }
        throw new Error("Environment variable REACT_APP_AREA_IMAGES is not set");
    }

    public static get Protocol(): string {
        const protocol = process.env.REACT_APP_PROTOCOL;
        if (protocol && protocol !== "") {
            return protocol;
        }
        throw new Error("Environment variable REACT_APP_PROTOCOL is not set");
    }
}

export { EndPoints }
