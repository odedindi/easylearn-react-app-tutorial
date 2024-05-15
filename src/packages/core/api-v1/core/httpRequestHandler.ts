import type { RequestExecutionConfig, RequestHandler as HttpRequestHandler } from '@packages/core/http';
import type {
    ApiV1Request,
    ApiV1RequestExecutionSettings,
    ApiV1RequestResponse,
    ApiV1Response,
    ApiV1ResponseTypes,
} from './types';
import type { ApiV1RequestHandler } from './requestHandler';

type AccessTokenFinder = () => null | string;

export class HttpApiV1RequestHandler implements ApiV1RequestHandler {
    private readonly baseUrl: string;
    private readonly requestHandler: HttpRequestHandler;
    private readonly findAccessToken: AccessTokenFinder;
    private runningRequestIds: string[];

    constructor(requestHandler: HttpRequestHandler, findAccessToken: AccessTokenFinder, baseUrl: string) {
        this.baseUrl = baseUrl;
        this.requestHandler = requestHandler;
        this.findAccessToken = findAccessToken;
        this.runningRequestIds = [];
    }

    public async executeRequest<Payload, Data extends { data?: unknown }>(
        settings: ApiV1RequestExecutionSettings<ApiV1Request<Payload>>
    ): Promise<
        ApiV1RequestResponse<
            ApiV1Request<Payload>,
            ApiV1Response<ApiV1ResponseTypes.SUCCESS, Data> | ApiV1Response<ApiV1ResponseTypes.ERROR, {}>
        >
    > {
        const requestFromTransformer = settings.transformer.createHttpRequest(settings.request);

        const accessToken = this.findAccessToken();

        const requestExecutionCnf: RequestExecutionConfig = {
            onProgress: settings.onProgress,
            request: {
                ...requestFromTransformer,
                url: `${this.baseUrl}${requestFromTransformer.url}`,
                id: settings.request.id,
            },
        };
        if (accessToken) requestExecutionCnf.request.headers.Authorization = `Bearer ${accessToken}`;
        const that = this;
        this.runningRequestIds.push(requestExecutionCnf.request.id);
        return new Promise((resolve) => {
            this.requestHandler
                .executeRequest(requestExecutionCnf)
                .then((requestResponse): void => {
                    const rr = settings.transformer.createRequestResponse(
                        requestResponse,
                        settings.request
                    ) as ApiV1RequestResponse<
                        ApiV1Request<Payload>,
                        ApiV1Response<ApiV1ResponseTypes.SUCCESS, Data> | ApiV1Response<ApiV1ResponseTypes.ERROR, {}>
                    >;
                    resolve(rr);
                })
                .finally(() => {
                    that.runningRequestIds = that.runningRequestIds.filter(
                        (requestId) => requestExecutionCnf.request.id !== requestId
                    );
                });
        });
    }

    public cancelAllRequests() {
        const that = this;
        this.runningRequestIds.forEach((requestId) => that.cancelRequestById(requestId));
    }

    public cancelRequestById(requestId: string) {
        this.requestHandler.cancelRequestById(requestId);
    }
}
