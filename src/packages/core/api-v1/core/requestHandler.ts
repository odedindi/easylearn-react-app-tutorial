import type {
    ApiV1Request,
    ApiV1RequestExecutionSettings,
    ApiV1RequestResponse,
    ApiV1Response,
    ApiV1ResponseTypes,
} from './types';

export interface ApiV1RequestHandler {
    executeRequest: <Payload extends unknown, Data extends { [key: string]: unknown } = {}>(
        _settings: ApiV1RequestExecutionSettings<ApiV1Request<Payload>>
    ) => Promise<
        ApiV1RequestResponse<
            ApiV1Request<Payload>,
            ApiV1Response<ApiV1ResponseTypes.SUCCESS, Data> | ApiV1Response<ApiV1ResponseTypes.ERROR>
        >
    >;
    cancelAllRequests: () => void;
    cancelRequestById: (_requestId: string) => void;
}
