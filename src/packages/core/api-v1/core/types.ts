import { Request, RequestMethod, RequestResponse, Response } from '@packages/core/http';
import { ApiV1ErrorMessage } from './errorMessages';

export interface ApiV1Translation {
    id: ApiV1ErrorMessage;
}

export interface ApiV1Message {
    id: string;
    severity: 'info' | 'success' | 'warning' | 'error';
    translation: ApiV1Translation;
}

export type ApiV1FieldMessagePath = (string | number)[];

export interface ApiV1FieldMessage {
    path: ApiV1FieldMessagePath;
    message: ApiV1Message;
}

export interface ApiV1EndpointId {
    method: RequestMethod;
    path: string;
}

export interface ApiV1Request<Payload = any> {
    id: string;
    endpointId: ApiV1EndpointId;
    payload: Payload;
}

export interface ApiV1ResponseBodyBase {
    success: boolean;
    fieldMessages: ApiV1FieldMessage[];
    generalMessages: ApiV1Message[];
}

export enum ApiV1ResponseTypes {
    // eslint-disable-next-line no-unused-vars
    SUCCESS = 'success',
    // eslint-disable-next-line no-unused-vars
    ERROR = 'error',
}

export interface ApiV1Response<T extends ApiV1ResponseTypes, Body extends object = {}>
    extends Response<Body & ApiV1ResponseBodyBase> {
    type: T;
}

export interface ApiV1RequestResponse<
    Req extends ApiV1Request<unknown>,
    Res extends ApiV1Response<ApiV1ResponseTypes>,
> {
    request: Req;
    response?: Res;
    hasRequestBeenCancelled: boolean;
}

export interface ApiV1EndpointTransformer<Req extends ApiV1Request, Res extends ApiV1Response<ApiV1ResponseTypes>> {
    endpointId: ApiV1EndpointId;
    createHttpRequest: (_request: Req) => Request;
    createRequestResponse: (_rr: RequestResponse, _request: Req) => ApiV1RequestResponse<Req, Res>;
}

export interface ApiV1RequestExecutionSettings<R extends ApiV1Request> {
    request: R;
    transformer: ApiV1EndpointTransformer<R, ApiV1Response<ApiV1ResponseTypes>>;
    onProgress?: (_percentage: number) => void;
}
