import type { FC } from 'react';
import { FunctionalLink } from '@components/ui/routing';
import { useTranslation } from 'react-i18next';
import { ALL_LANGUAGES } from 'src/i18n';
import { styled } from '@mui/material';

const Base = styled('footer')`
    display: flex;
    justify-content: space-around;
    margin-top: 60px;
`;

const FooterLink = styled(FunctionalLink)<{ selected?: Boolean }>`
    color: ${({ selected }) => (selected ? '#bbb' : '#ddd')};
    text-decoration: none;
    margin: 0 5px;
    font-family: inherit;
    font-size: 12px;
`;

export const Footer: FC = () => {
    const { t, i18n } = useTranslation();

    return (
        <Base>
            <div>
                {ALL_LANGUAGES.map((lng) => (
                    <FooterLink
                        key={lng}
                        selected={i18n.resolvedLanguage === lng}
                        onClick={() => i18n.changeLanguage(lng)}>
                        {t(`core.languages.${lng}`)}
                    </FooterLink>
                ))}
            </div>
        </Base>
    );
};
