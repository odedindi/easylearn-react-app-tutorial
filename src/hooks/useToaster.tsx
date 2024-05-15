import { ReactNode, useCallback } from 'react';
import { type Severity, type ExpandableContent, useSnackbar } from 'notistack';

export interface ToastConfig {
    severity: Severity;
    expandableContent: ExpandableContent;
    autoHideDuration?: number;
    transitionDuration?: number;
}

const autoHideDurationInMs = 1000;
const snackbarCloseAnimationDurationInMs = 300;

export const useToaster = () => {
    const { enqueueSnackbar } = useSnackbar();

    const showMessage = useCallback(
        (message: ReactNode, config?: Partial<ToastConfig>) =>
            enqueueSnackbar(message, {
                variant: 'toaster',
                anchorOrigin: { horizontal: 'center', vertical: 'top' },
                autoHideDuration: config?.autoHideDuration ?? autoHideDurationInMs,
                transitionDuration: { exit: config?.transitionDuration ?? snackbarCloseAnimationDurationInMs },
                severity: config?.severity, // defaults to success
                expandableContent: config?.expandableContent,
            }),
        [enqueueSnackbar]
    );
    return { showMessage };
};
