import { forwardRef, useCallback, useState } from 'react';
import {
    type CustomContentProps,
    type Severity,
    type ExpandableContent,
    SnackbarContent,
    useSnackbar,
} from 'notistack';
import Collapse from '@mui/material/Collapse';
import MuiTypography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import MuiCardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material';

const Base = styled(SnackbarContent)({
    '@media (min-width:600px)': { minWidth: '344px !important' },
});
const Card = styled(MuiCard)<{ severity: Severity }>(({ theme: { palette }, severity }) => ({
    width: '100%',
    background: palette[severity][palette.mode],
}));
const Typography = styled(MuiTypography)({ color: '#000' });
const CardActions = styled(MuiCardActions)({ padding: '8px 8px 8px 16px', justifyContent: 'space-between' });
const IconsWrapper = styled('div')({ marginLeft: 'auto' });
const ExpandButton = styled(IconButton)<{ expanded?: 0 | 1 }>(({ expanded }) => ({
    padding: '8px 8px',
    color: '#000',
    transition: 'transform 0.2s',
    transform: expanded ? 'rotate(180deg)' : 'init',
}));

interface ToastProps extends CustomContentProps {
    severity: Severity;
    expandableContent?: ExpandableContent;
}

const Toaster = forwardRef<HTMLDivElement, ToastProps>(function Toaster(
    { id, message, severity, expandableContent },
    ref
) {
    const { closeSnackbar } = useSnackbar();
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = useCallback(() => setExpanded((prevExpanded) => !prevExpanded), []);

    const handleDismiss = useCallback(() => closeSnackbar(id), [id, closeSnackbar]);

    return (
        <>
            <Base ref={ref} role="alert">
                <Card severity={severity ?? 'success'}>
                    <CardActions>
                        <Typography variant="body2">{message}</Typography>
                        <IconsWrapper>
                            {expandableContent ? (
                                <ExpandButton
                                    aria-label="Show more"
                                    size="small"
                                    expanded={expanded ? 1 : 0}
                                    onClick={handleExpandClick}>
                                    <ExpandMoreIcon />
                                </ExpandButton>
                            ) : null}
                            <ExpandButton size="small" onClick={handleDismiss}>
                                <CloseIcon fontSize="small" />
                            </ExpandButton>
                        </IconsWrapper>
                    </CardActions>
                    {expandableContent ? (
                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                            {typeof expandableContent === 'function'
                                ? expandableContent(handleDismiss)
                                : expandableContent}
                        </Collapse>
                    ) : null}
                </Card>
            </Base>
        </>
    );
});

export default Toaster;
