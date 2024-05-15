import type { FC } from 'react';
import { useTitle } from '@hooks/useTitle';
import { useTranslation } from 'react-i18next';
import { useToaster } from '@hooks/useToaster';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useAuth } from 'src/providers/sessionProvider';
import { FunctionalLink } from '@components/ui/routing';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const IndexPage: FC = () => {
    const { t } = useTranslation();
    useTitle(t('pages.indexPage.title'));
    const toaster = useToaster();
    const { data: sessionData, isLoggedIn } = useAuth().session;

    const username = isLoggedIn ? sessionData.user.username : t('core.currentUser.guestDisplayName');
    const greeting = t('pages.indexPage.greeting', { username });
    return (
        <>
            {greeting}
            <div style={{ marginTop: '15px' }}>
                <Alert severity="info">
                    <strong>MuiToasterSubscriber:</strong>
                    <br />
                    Note that if a toast message is displayed and you click outside of it, this toast message will
                    automatically be closed.
                    <br />
                    <br />
                    <FunctionalLink onClick={() => toaster.showMessage(greeting, { autoHideDuration: 1000000 })}>
                        trigger info toast
                    </FunctionalLink>
                    <br />
                    <FunctionalLink
                        onClick={() => {
                            toaster.showMessage(<>First: {greeting}</>, {
                                severity: 'success', // defaults to success
                                autoHideDuration: 1500, // defaults to 1000
                            });
                            toaster.showMessage(<>Second: {greeting}</>, { severity: 'error' });
                            toaster.showMessage(<>Third: ${greeting}</>);
                            toaster.showMessage(`You can also just pass a string: ${greeting}`);
                            toaster.showMessage(<>You can also pass additional content</>, {
                                severity: 'warning',
                                autoHideDuration: 5000,
                                expandableContent: (
                                    <Paper>
                                        <Typography gutterBottom variant="caption" sx={{ display: 'block' }}>
                                            Demo content
                                        </Typography>
                                        <Button size="small" color="primary">
                                            <CheckCircleIcon sx={{ fontSize: 20, pr: 4 }} />
                                            Demo action button
                                        </Button>
                                    </Paper>
                                ),
                            });
                            toaster.showMessage(<>And pass arguments as well</>, {
                                severity: 'info',
                                autoHideDuration: 100000,
                                expandableContent: (handleDismiss) => (
                                    <Paper>
                                        <Typography gutterBottom variant="caption" sx={{ display: 'block' }}>
                                            Demo content
                                        </Typography>
                                        <Button size="small" color="primary" onClick={handleDismiss} fullWidth>
                                            <CheckCircleIcon sx={{ mr: 1 }} />
                                            Demo action button
                                        </Button>
                                    </Paper>
                                ),
                            });
                        }}>
                        trigger multiple success toasts
                    </FunctionalLink>
                    <CheckCircleIcon />
                </Alert>
            </div>
        </>
    );
};
