import { type FC, type PropsWithChildren, useRef } from 'react';
import { AxiosRequestHandler } from '@packages/core/http';
import {
    HttpApiV1RequestHandler,
    ScopedApiV1RequestHandler,
    ScopedApiV1RequestHandlerProvider,
} from '@packages/core/api-v1/core';
import { type Session, useAuth } from './sessionProvider';
import { ApiV1ToasterMiddleware, ApiV1ToasterMiddlewareProvider } from '@packages/core/api-v1/core/toasterMiddleware';
import { useToaster } from '@hooks/useToaster';
import { useTranslation } from 'react-i18next';

const apiV1BaseUrl = 'http://localhost:9000/api/v1';

const createScopedApiV1RequestHandler = ({ data: sessionData, isLoggedIn }: Session): ScopedApiV1RequestHandler => {
    const httpRequestHandler = new AxiosRequestHandler();
    const httpApiV1RequestHandler = new HttpApiV1RequestHandler(
        httpRequestHandler,
        () => (isLoggedIn ? sessionData.apiKey : null),
        apiV1BaseUrl
    );
    return new ScopedApiV1RequestHandler(httpApiV1RequestHandler);
};

const ApiV1Provider: FC<PropsWithChildren> = ({ children }) => {
    const { session } = useAuth();

    const apiV1RequestHandlerRef = useRef(createScopedApiV1RequestHandler(session));

    const toaster = useToaster();
    const { t } = useTranslation();

    const apiV1ToasterMiddlewareRef = useRef(new ApiV1ToasterMiddleware(toaster, t));

    return (
        <ScopedApiV1RequestHandlerProvider value={apiV1RequestHandlerRef.current}>
            <ApiV1ToasterMiddlewareProvider value={apiV1ToasterMiddlewareRef.current} />
            {children}
        </ScopedApiV1RequestHandlerProvider>
    );
};

export default ApiV1Provider;
