import { type Response, createRequest, type Request } from '@packages/core/http';
import type { ApiV1EndpointId, ApiV1FieldMessage, ApiV1Message, ApiV1Request, ApiV1ResponseBodyBase } from './types';
import { createUniqueId } from '@utils/createUniqueId';

type AnyResponse = Response<{
    success: boolean;
    generalMessages?: ApiV1Message[];
    fieldMessages?: ApiV1FieldMessage[];
}>;

export function createApiV1BasicResponseBody(response: Response): ApiV1ResponseBodyBase {
    const r = response as AnyResponse;
    return {
        success: r.body.success,
        fieldMessages: r.body.fieldMessages ?? [],
        generalMessages: r.body.generalMessages ?? [],
    };
}

type PathParams = { [paramName: string]: string };
type QueryParams = object;
type BodyParams = object;

const createUrl = (urlWithVars: string, pathParams: PathParams): string =>
    Object.values(pathParams).reduce((url, param) => {
        return url.replaceAll(`{${param}}`, pathParams[param]);
    }, urlWithVars);

type HttpRequestCreationOptions = {
    pathParams?: PathParams;
    queryParams?: QueryParams;
    bodyParams?: BodyParams;
};

export const createHttpRequestFromRequest = (
    request: ApiV1Request,
    options: HttpRequestCreationOptions = {}
): Request =>
    createRequest({
        url:
            options && options.pathParams
                ? createUrl(request.endpointId.path, options.pathParams)
                : request.endpointId.path,
        method: request.endpointId.method,
        id: request.id,
        queryParameters: options.queryParams,
        body: options.bodyParams,
    });

export type RequestBase = Pick<ApiV1Request, 'id' | 'endpointId'>;
export const createRequestBase = (endpointId: ApiV1EndpointId): RequestBase => ({
    id: createUniqueId(),
    endpointId,
});
