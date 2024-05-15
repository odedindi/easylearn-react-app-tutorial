export const apiV1ErrorMessageKeys = {
    required: 'api.v1.required',
    invalidValue: 'api.v1.invalidValue',
    invalidEmail: 'api.v1.invalidEmail',
    formErrors: 'api.v1.formErrors',
    userWasCreated: 'api.v1.userWasCreated',
} as const;

const apiV1ErrorMessages = Object.values(apiV1ErrorMessageKeys);

export const sanitizeApiV1ErrorMessage = (message: string): ApiV1ErrorMessage =>
    apiV1ErrorMessages.find((m) => m === message) ?? apiV1ErrorMessageKeys.invalidValue;

export type ApiV1ErrorMessage = (typeof apiV1ErrorMessages)[number];
