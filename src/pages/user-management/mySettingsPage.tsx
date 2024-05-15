import { useTitle } from '@hooks/useTitle';
import type { FC } from 'react';

export const MySettingsPage: FC = () => {
    useTitle('My Settings');
    return <>My settings Page</>;
};
