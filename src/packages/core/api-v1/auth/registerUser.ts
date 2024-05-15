// src/packages/core/api-v1/auth/registerUser.ts

import { GenderId } from 'src/pages/auth/registerPage';
import {
    type ApiV1RequestHandler,
    type ApiV1RequestResponse,
    type ApiV1Response,
    createApiV1BasicResponseBody,
    createHttpRequestFromRequest,
    createRequestBase,
    type ApiV1EndpointTransformer,
    type ApiV1EndpointId,
    type ApiV1Request,
    type ApiV1ResponseTypes,
} from '../core';
import type { RequestResponse, Response as HttpResponse } from '@packages/core/http';

const endpointId: ApiV1EndpointId = { method: 'post', path: '/auth/register' };

type AuthUser = {
    apiKey: string;
    user: {
        id: string;
        username: string;
    };
};

type RegisterUserResponse =
    | ApiV1Response<ApiV1ResponseTypes.SUCCESS, { data: AuthUser }>
    | ApiV1Response<ApiV1ResponseTypes.ERROR>;

type RegisterUserPayload = {
    gender: GenderId;
    email: string;
    username: string;
    password: string;
};

type RegisterUserRequest = ApiV1Request<RegisterUserPayload>;

const createRegisterUserRequest = (payload: RegisterUserPayload): RegisterUserRequest => ({
    ...createRequestBase(endpointId),
    payload,
});

const registerUserTransformer: ApiV1EndpointTransformer<RegisterUserRequest, RegisterUserResponse> = {
    endpointId: endpointId,
    createHttpRequest: (request) => ({
        ...createHttpRequestFromRequest(request),
        body: request.payload,
    }),
    createRequestResponse: (rr: RequestResponse, request) => {
        if (!rr.response) {
            return {
                request,
                hasRequestBeenCancelled: rr.hasRequestBeenCancelled,
                response: undefined,
            };
        }
        if (rr.response.status === 201) {
            const realSuccessResponse = rr.response as HttpResponse<{ data: AuthUser }>;
            return {
                request,
                hasRequestBeenCancelled: rr.hasRequestBeenCancelled,
                response: {
                    ...realSuccessResponse,
                    type: 'success',
                    body: {
                        ...createApiV1BasicResponseBody(realSuccessResponse),
                        ...rr.response.body,
                    },
                },
            };
        }
        const realErrorResponse = rr.response;
        return {
            request,
            hasRequestBeenCancelled: rr.hasRequestBeenCancelled,
            response: {
                ...realErrorResponse,
                type: 'error',
                body: createApiV1BasicResponseBody(realErrorResponse),
            },
        };
    },
};

export type RegisterUserRequestResponse = ApiV1RequestResponse<RegisterUserRequest, RegisterUserResponse>;

export const registerUser = async (
    requestHandler: ApiV1RequestHandler,
    payload: RegisterUserPayload
): Promise<RegisterUserRequestResponse> =>
    requestHandler.executeRequest({
        request: createRegisterUserRequest(payload),
        transformer: registerUserTransformer,
        onProgress: undefined,
    });
