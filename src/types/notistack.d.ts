import type { AlertProps } from '@mui/material';
import { ReactNode } from 'react';

declare module 'notistack' {
    type Severity = NonNullable<AlertProps['severity']>;
    type ExpandableContent = ReactNode | ((_onClose: () => void) => ReactNode);
    interface VariantOverrides {
        toaster: {
            severity?: Severity;
            // content?: ReactNode; // content key is deprecated better use something else
            expandableContent?: ExpandableContent;
        };
    }
}
