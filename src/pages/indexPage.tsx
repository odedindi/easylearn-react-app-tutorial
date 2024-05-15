import type { FC } from 'react';
import { useTitle } from '@hooks/useTitle';

export const IndexPage: FC = () => {
    useTitle('Home');
    return <>Index Page</>;
};
