import type { FC } from 'react';
import { useTitle } from '@hooks/useTitle';

export const NotFoundPage: FC = () => {
    useTitle('Not Found');
    return <>Not Found Page</>;
};
