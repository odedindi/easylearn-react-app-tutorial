import { Request } from './request';

export interface Response<Body = any, Headers extends object = any> {
    status: number;
    headers: Headers;
    body: Body;
}

export interface RequestResponse<Res extends Response = any, Req extends Request = any> {
    request: Req;
    response?: Res;
    hasRequestBeenCancelled: boolean;
}

export interface RequestExecutionConfig {
    request: Request;
    onProgress?: (_percentage: number) => void;
}

export interface RequestHandler {
    executeRequest: (_config: RequestExecutionConfig) => Promise<RequestResponse>;
    cancelRequestById(_requestId: string): void;
}
