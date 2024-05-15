import { config } from '@config/index';
import { useEffect } from 'react';

export const useTitle = (title?: string): void => {
    useEffect(() => {
        if (!document) return;
        const prevTitle = document.title;
        document.title = [title ?? '', config.companyName].filter((str) => str?.length).join(' :: ');

        return () => {
            document.title = prevTitle;
        };
    }, [title]);
};
