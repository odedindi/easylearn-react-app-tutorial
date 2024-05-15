import { type ReactNode, createContext, useContext } from 'react';
import { ApiV1RequestHandlerMiddleware } from './scopedRequestHandler';
import { ApiV1Message, ApiV1RequestResponse } from './types';
import { type ToastConfig } from '@hooks/useToaster';
import { SnackbarKey } from 'notistack';
import { TFunction } from 'i18next';

type Toaster = {
    showMessage: (_message: ReactNode, _config?: Partial<ToastConfig>) => SnackbarKey;
};
export class ApiV1ToasterMiddleware implements ApiV1RequestHandlerMiddleware {
    private readonly toaster: Toaster;
    private readonly t: TFunction;

    constructor(toaster: Toaster, t: TFunction) {
        this.toaster = toaster;
        this.t = t;
    }

    onRequestResponse(rr: ApiV1RequestResponse<any, any>) {
        if (rr.hasRequestBeenCancelled) {
            return;
        }
        if (!rr.response) {
            this.toaster.showMessage(this.t('core.util.connectionToServerFailed'), {
                severity: 'error',
                autoHideDuration: 5000,
            });
            return;
        }

        rr.response.body.generalMessages.map((m: ApiV1Message) =>
            this.toaster.showMessage(
                <>
                    <strong>Error:</strong> {this.t(m.translation.id)}
                </>,
                {
                    severity: m.severity,
                    autoHideDuration: 5000,
                }
            )
        );
    }
}

const toasterMiddlewareContext = createContext<ApiV1ToasterMiddleware | null>(null);

export const ApiV1ToasterMiddlewareProvider = toasterMiddlewareContext.Provider;

export function useNullableApiV1ToasterMiddleware() {
    return useContext(toasterMiddlewareContext);
}
