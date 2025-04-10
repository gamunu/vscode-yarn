declare module 'node-fetch' {
    export default function fetch(url: string, init?: RequestInit): Promise<Response>;
    
    export interface RequestInit {
        method?: string;
        headers?: any;
        body?: any;
        mode?: string;
        credentials?: string;
        cache?: string;
        redirect?: string;
        referrer?: string;
        referrerPolicy?: string;
        integrity?: string;
        keepalive?: boolean;
        signal?: AbortSignal;
        window?: null;
    }
    
    export interface Response {
        ok: boolean;
        status: number;
        statusText: string;
        headers: Headers;
        body: any;
        type: string;
        url: string;
        redirected: boolean;
        
        json(): Promise<any>;
        text(): Promise<string>;
        arrayBuffer(): Promise<ArrayBuffer>;
        blob(): Promise<Blob>;
        formData(): Promise<FormData>;
    }
    
    export interface Headers {
        append(name: string, value: string): void;
        delete(name: string): void;
        get(name: string): string | null;
        has(name: string): boolean;
        set(name: string, value: string): void;
        forEach(callback: (value: string, name: string) => void): void;
    }
    
    export class Request {
        constructor(input: string | Request, init?: RequestInit);
        clone(): Request;
    }
    
    export class Response {
        constructor(body?: BodyInit, init?: ResponseInit);
        static error(): Response;
        static redirect(url: string, status?: number): Response;
        clone(): Response;
    }
    
    export interface ResponseInit {
        status?: number;
        statusText?: string;
        headers?: HeadersInit;
    }
    
    export type HeadersInit = Headers | string[][] | Record<string, string>;
    export type BodyInit = ArrayBuffer | ArrayBufferView | string | URLSearchParams | FormData | ReadableStream | Blob;
}
