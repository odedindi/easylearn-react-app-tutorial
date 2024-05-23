import { useState, type FC, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { FunctionalLink, RoutingLink } from '@components/ui/routing';
import { Home } from '@mui/icons-material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { mockedAuthenticatedUser, useAuth } from 'src/providers/sessionProvider';
import { config } from '@config/index';

const LoggedInUserMenu: FC = () => {
    const navigate = useNavigate();

    const { session, signout } = useAuth();
    const { data: sessionData, isLoggedIn } = session;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    if (!isLoggedIn) return null;

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
    const closeMenu = () => setAnchorEl(null);

    const isMenuOpen = !!anchorEl;
    return (
        <>
            <Button
                id="basic-button"
                aria-controls={isMenuOpen ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={isMenuOpen ? 'true' : undefined}
                onClick={handleClick}>
                {sessionData.user.username}
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={closeMenu}
                MenuListProps={{ 'aria-labelledby': 'basic-button' }}>
                <MenuItem
                    onClick={() => {
                        navigate('/user-management/my-settings');
                        closeMenu();
                    }}>
                    My settings
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        signout({ redirect: '/' });
                        closeMenu();
                    }}>
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
};

export const Nav: FC = () => {
    const { t } = useTranslation();

    const navigate = useNavigate();

    const {
        session: { isLoggedIn },
        signin,
    } = useAuth();

    const loginUser = () => {
        signin(mockedAuthenticatedUser);
    };

    return (
        <Toolbar sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '15px' }}>
            <RoutingLink to="/">
                <Home />
            </RoutingLink>
            <Typography component="h2" variant="h5" color="inherit" align="center" noWrap sx={{ flex: 1 }}>
                {config.companyName}
            </Typography>
            {!isLoggedIn && (
                <>
                    <FunctionalLink onClick={loginUser} noWrap variant="button" sx={{ p: 1, flexShrink: 0 }}>
                        {t('core.nav.login')}
                    </FunctionalLink>
                    <Button variant="outlined" size="small" onClick={() => navigate('/auth/register')}>
                        {t('core.nav.signUp')}
                    </Button>
                </>
            )}

            {isLoggedIn && <LoggedInUserMenu />}
        </Toolbar>
    );
};
