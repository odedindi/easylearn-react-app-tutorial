import { createUniqueId } from '@utils/createUniqueId';

export type RequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface Request<Body = any, Qry = any, Headers = any> {
    id: string;
    url: string;
    method: RequestMethod;
    headers: Headers;
    queryParameters: Qry;
    body: Body;
}

type CreationSettings = Pick<Request, 'url' | 'method'> & Partial<Omit<Request, 'url' | 'method'>>;
export const createRequest = (settings: CreationSettings): Request => ({
    id: createUniqueId(),
    body: {},
    headers: {},
    queryParameters: undefined,
    ...settings,
});
