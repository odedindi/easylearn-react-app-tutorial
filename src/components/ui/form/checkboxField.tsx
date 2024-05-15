import type { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import MuiFormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { styled } from '@mui/material';
import MuiCheckbox from '@mui/material/Checkbox';
import { ApiV1ErrorMessage } from '@packages/core/api-v1/core';

const StyledFormControlLabel = styled(MuiFormControlLabel)`
    > .MuiStack-root {
        display: flex;
        flex-direction: row;
    }
`;

interface CheckboxFieldProps {
    label: ReactNode;
    name: string;
    errorMessage?: ApiV1ErrorMessage;
    required?: boolean;
}

const CheckboxField: FC<CheckboxFieldProps> = ({ label, name, errorMessage, required }) => {
    const { t } = useTranslation();
    const parsedErrorMessage = errorMessage ? t(errorMessage) : undefined;
    return (
        <FormControl margin="dense" fullWidth error={!!parsedErrorMessage}>
            <StyledFormControlLabel
                required={required}
                label={
                    <Typography variant="body1" color={parsedErrorMessage ? 'danger' : 'inherit'}>
                        {label}
                    </Typography>
                }
                control={<MuiCheckbox name={name} />}
            />
            {parsedErrorMessage ? <FormHelperText>{parsedErrorMessage}</FormHelperText> : null}
        </FormControl>
    );
};
export default CheckboxField;
