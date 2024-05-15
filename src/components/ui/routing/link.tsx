import type { FC } from 'react';
import MuiLink, { type LinkProps as MuiLinkProps } from '@mui/material/Link';
import { Link as ReactRouterDomLink } from 'react-router-dom';

type RoutingLinkProps = Omit<MuiLinkProps, 'component'> & {
    to: string;
};

export const RoutingLink: FC<RoutingLinkProps> = (props) => <MuiLink {...props} component={ReactRouterDomLink} />;

interface FunctionalLinkProps extends Omit<MuiLinkProps, 'href'> {
    onClick: () => void;
}

export const FunctionalLink: FC<FunctionalLinkProps> = ({ sx, ...props }) => (
    <MuiLink
        {...props}
        sx={[{ cursor: 'pointer' }, ...(Array.isArray(sx) ? sx : [sx])]}
        onClick={(event) => {
            event.preventDefault();
            props.onClick?.();
        }}
    />
);
