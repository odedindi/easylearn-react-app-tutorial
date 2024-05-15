import type { FC } from 'react';
import { useTitle } from '@hooks/useTitle';
import { useTranslation } from 'react-i18next';

export const IndexPage: FC = () => {
    const { t } = useTranslation();
    useTitle(t('pages.indexPage.title'));
    return <>Index Page</>;
};
