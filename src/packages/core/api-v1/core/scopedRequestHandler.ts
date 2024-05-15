import { createContext, useContext, useEffect, useRef } from 'react';
import {
    ApiV1Request,
    ApiV1RequestExecutionSettings,
    ApiV1RequestResponse,
    ApiV1Response,
    ApiV1ResponseTypes,
} from './types';
import { ApiV1RequestHandler } from './requestHandler';

import { useNullableApiV1ToasterMiddleware } from './toasterMiddleware';

type ReqRes<Payload, Data extends { [key: string]: unknown }> = ApiV1RequestResponse<
    ApiV1Request<Payload>,
    ApiV1Response<ApiV1ResponseTypes.SUCCESS, Data> | ApiV1Response<ApiV1ResponseTypes.ERROR, {}>
>;
export type ApiV1RequestHandlerMiddleware = {
    onRequest?: (_r: ApiV1Request) => void;
    onRequestResponse?: (
        _rr: ApiV1RequestResponse<
            ApiV1Request,
            ApiV1Response<ApiV1ResponseTypes.SUCCESS, object> | ApiV1Response<ApiV1ResponseTypes.ERROR, {}>
        >
    ) => void;
};
export class ScopedApiV1RequestHandler implements ApiV1RequestHandler {
    private readonly middlewares: ApiV1RequestHandlerMiddleware[] = [];
    private readonly requestHandler: ApiV1RequestHandler;
    private runningRequestIds: string[] = [];

    constructor(requestHandler: ApiV1RequestHandler) {
        this.requestHandler = requestHandler;

        this.createSeparated = this.createSeparated.bind(this);
        this.executeRequest = this.executeRequest.bind(this);
        this.cancelAllRequests = this.cancelAllRequests.bind(this);
        this.cancelRequestById = this.cancelRequestById.bind(this);
    }

    public createSeparated() {
        return new ScopedApiV1RequestHandler(this.requestHandler);
    }

    public addMiddleware(middleware: ApiV1RequestHandlerMiddleware) {
        this.middlewares.push(middleware);
    }

    public executeRequest<Payload, Data extends { [key: string]: unknown }>(
        settings: ApiV1RequestExecutionSettings<ApiV1Request<Payload>>
    ): Promise<ReqRes<Payload, Data>> {
        return new Promise((resolve) => {
            this.runningRequestIds.push(settings.request.id);
            this.middlewares.forEach((m) => m.onRequest?.(settings.request));
            this.requestHandler.executeRequest(settings).then((rr): void => {
                this.runningRequestIds = this.runningRequestIds.filter(
                    (requestId) => settings.request.id !== requestId
                );
                this.middlewares.forEach((m) => {
                    m.onRequestResponse?.(rr);
                });
                resolve(rr as ReqRes<Payload, Data>);
            });
        });
    }

    public cancelAllRequests() {
        this.runningRequestIds.forEach((requestId) => this.requestHandler.cancelRequestById(requestId));
    }

    public cancelRequestById(requestId: string) {
        if (!this.runningRequestIds.includes(requestId)) return;
        this.requestHandler.cancelRequestById(requestId);
    }
}

const scopedApiV1RequestHandlerContext = createContext<null | ScopedApiV1RequestHandler>(null);
export const ScopedApiV1RequestHandlerProvider = scopedApiV1RequestHandlerContext.Provider;

type UseApiV1RequestHandlerConfig = {
    showToasts?: boolean;
};

const defaultUseApiV1RequestHandlerConfig: UseApiV1RequestHandlerConfig = {
    showToasts: true,
};

export const useApiV1RequestHandler = (
    config: UseApiV1RequestHandlerConfig = defaultUseApiV1RequestHandlerConfig
): ApiV1RequestHandler => {
    const toasterMiddleware = useNullableApiV1ToasterMiddleware();

    const requestHandler = useContext(scopedApiV1RequestHandlerContext);
    const requestHandlerRef = useRef<ApiV1RequestHandler | null>(null);

    if (!requestHandler) throw new Error('no ScopedApiV1RequestHandler was provided');
    if (!requestHandlerRef.current) {
        const separatedRequestHandler = requestHandler.createSeparated();
        if (toasterMiddleware && config.showToasts) {
            separatedRequestHandler.addMiddleware(toasterMiddleware);
        }
        requestHandlerRef.current = separatedRequestHandler;
    }

    useEffect(() => {
        return () => {
            requestHandlerRef.current?.cancelAllRequests();
        };
    }, []);
    return requestHandlerRef.current;
};
