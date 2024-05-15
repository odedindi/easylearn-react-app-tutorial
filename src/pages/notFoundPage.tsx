import type { FC } from 'react';
import { useRouteError } from 'react-router-dom';
import { useTitle } from '@hooks/useTitle';

export const NotFoundPage: FC = () => {
    useTitle('Not Found');
    const error = useRouteError() as any;

    return (
        <>
            <h1>Not Found!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error?.statusText ?? error?.message}</i>
            </p>
        </>
    );
};
