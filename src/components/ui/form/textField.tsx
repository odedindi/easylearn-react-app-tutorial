import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import MuiTextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import type { ApiV1ErrorMessage } from '@packages/core/api-v1/core/errorMessages';

interface TextFieldProps {
    errorMessage?: ApiV1ErrorMessage;
    required?: boolean;
    label: string;
    type?: 'text' | 'password' | 'email';
    name: string;
    maxLength?: number;
}

const TextField: FC<TextFieldProps> = ({ errorMessage, type = 'text', maxLength = 16, ...props }) => {
    const { t } = useTranslation();
    const parsedErrorMessage = errorMessage ? t(errorMessage) : undefined;
    return (
        <FormControl margin="dense" fullWidth>
            <MuiTextField
                error={!!parsedErrorMessage}
                type={type}
                inputProps={{ maxLength }}
                variant="outlined"
                helperText={parsedErrorMessage}
                {...props}
            />
        </FormControl>
    );
};

export default TextField;
