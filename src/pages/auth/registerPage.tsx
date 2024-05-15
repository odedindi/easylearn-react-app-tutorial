import { useState, type FC, type FormEvent } from 'react';
import { useTitle } from '@hooks/useTitle';
import { useTranslation, Trans } from 'react-i18next';
import { FunctionalLink } from '@components/ui/routing';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useArrayCollection } from '@hooks/useArrayCollection';
import type { Entry } from '@packages/core/collection';
import { ApiV1ResponseTypes, useApiV1RequestHandler, type ApiV1ErrorMessage } from '@packages/core/api-v1/core';
import { registerUser } from '@packages/core/api-v1/auth';
import { useAuth } from 'src/providers/sessionProvider';

import SingleSelectField from '@components/ui/form/singleSelectField';
import TextField from '@components/ui/form/textField';
import CheckboxField from '@components/ui/form/checkboxField';

interface FormElements extends HTMLFormControlsCollection {
    gender: HTMLSelectElement;
    username: HTMLInputElement;
    email: HTMLInputElement;
    password: HTMLInputElement;
    termsAndConditions: HTMLInputElement;
}
interface RegisterPageFormElement extends HTMLFormElement {
    readonly elements: FormElements;
}

// Create the genders array
export type GenderId = 'female' | 'male' | 'other';
export const genderIds: Set<GenderId> = new Set(['female', 'male', 'other'] as GenderId[]);

const SelectGender: FC<{ errorMessage?: ApiV1ErrorMessage }> = ({ errorMessage }) => {
    const { t } = useTranslation('translation', { keyPrefix: 'pages.registerPage' });
    const [genderFieldValue, setGenderFieldValue] = useState<Entry<GenderId> | null>(null);

    const genderIdsArrayCollection = useArrayCollection<GenderId>({
        dataArray: Array.from(genderIds),
        createEntryKey: (gId) => gId,
    });
    return (
        <SingleSelectField
            data={{ chosenOption: genderFieldValue, errorMessage }}
            onChange={(data) => setGenderFieldValue(data.chosenOption)}
            provider={genderIdsArrayCollection}
            renderOption={(e: Entry<GenderId>) => {
                if (genderIds.has(e.data)) return t(`genderOptions.${e.data}`);
                console.error(`genderId "${e.data}" is not supported!`);
                return null;
            }}
            label={t('gender')}
            variant="outlined"
            margin="dense"
            canChooseNone
            fullWidth
            name="gender"
        />
    );
};

// Register page

export const RegisterPage: FC = () => {
    const { t } = useTranslation('translation', { keyPrefix: 'pages.registerPage' });
    useTitle(t('title'));

    const { signin } = useAuth();
    const apiV1RequestHandler = useApiV1RequestHandler();

    const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormElements, ApiV1ErrorMessage>>>({});
    const [disableSubmitButton, setDisableSubmitButton] = useState<boolean>(false);
    const onSubmit = async (e: FormEvent<RegisterPageFormElement>): Promise<void> => {
        e.preventDefault();
        const formElements = e.currentTarget.elements;
        // currently only termsAndConditions is set as required field in our form,
        // submi should be disabled if the form is not valid,
        // and we can check the validity of the form like this:
        const isFormValid = e.currentTarget.checkValidity();
        // verifying checked status of the termsAndConditions checkbox can be done like this:
        // const termsAndConditionsChecked: boolean = formElements.termsAndConditions.checked;
        if (!isFormValid) {
            console.info('[Error] Form is not valid! Check the fields for errors.');
            return;
        }
        const formData = {
            gender: formElements.gender.value as GenderId, // better to use a type guard here to ensure the value is a GenderId anyway it should be varified on the api side
            username: formElements.username.value,
            email: formElements.email.value,
            password: formElements.password.value,
            // termsAndConditions: formElements.termsAndConditions.checked, // not reqested by the API
        };

        console.log('Form submitted: ', { formData });
        registerUser(apiV1RequestHandler, formData).then(({ response }) => {
            if (!response) return;
            setDisableSubmitButton(true);
            if (response.type !== ApiV1ResponseTypes.SUCCESS) {
                const errorMessages = response.body.fieldMessages.reduce(
                    (
                        errorMessagesAcc,
                        {
                            message: {
                                severity,
                                translation: { id: apiV1MessageTranslationKey }, // { id: apiV1MessageTranslationKey }, placeholder for better readability
                            },
                            path: [formElement],
                        }
                    ) =>
                        severity === 'error'
                            ? { ...errorMessagesAcc, [formElement]: apiV1MessageTranslationKey }
                            : errorMessagesAcc,
                    {}
                );
                setFormErrors(errorMessages);
                setDisableSubmitButton(false);
                return;
            }
            const data = response.body.data;

            signin(
                {
                    type: 'authenticated',
                    apiKey: data.apiKey,
                    user: data.user,
                },
                { redirect: '/' }
            );
        });
    };
    return (
        <>
            <Typography component="h1" variant="h5">
                {t('title')}
            </Typography>
            <form onSubmit={onSubmit}>
                <SelectGender errorMessage={formErrors.gender} />
                <TextField
                    errorMessage={formErrors.username}
                    // required // can be set as required in the form
                    label={t('username')}
                    name="username"
                />
                <TextField
                    errorMessage={formErrors.email}
                    label={t('email')}
                    maxLength={191}
                    // type="email" // can be used for the native validation
                    name="email"
                />
                <TextField errorMessage={formErrors.password} label={t('password')} type="password" name="password" />
                <CheckboxField
                    name="termsAndConditions"
                    label={
                        <Trans
                            t={t}
                            i18nKey="agreeOnTermsAndConditions"
                            components={[
                                <FunctionalLink key={0} onClick={() => console.log('open terms and conditions')} />,
                            ]}
                        />
                    }
                    errorMessage={formErrors.termsAndConditions}
                    required
                />
                <Button type="submit" disabled={disableSubmitButton} variant="outlined" color="primary" fullWidth>
                    {t('signUp')}
                </Button>
            </form>
        </>
    );
};
