declare namespace NodeJS {
    interface ProcessEnv {
        BACKEND_API_URL: string;
        [key: string]: string | undefined;
    }
}
