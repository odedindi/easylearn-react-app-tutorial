import type { FC, ReactNode } from 'react';
import type { CollectionProvider, Entry } from '@packages/core/collection';
import Select from '../primitives/select';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl, { type FormControlProps } from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { ApiV1ErrorMessage } from '@packages/core/api-v1/core';
import { useTranslation } from 'react-i18next';

type SingleSelectFieldData = {
    chosenOption: null | Entry;
    errorMessage?: ApiV1ErrorMessage;
};

interface SingleSelectionFieldProps<Data = unknown>
    extends Pick<FormControlProps, 'margin' | 'variant' | 'fullWidth' | 'size' | 'disabled'> {
    label?: ReactNode;

    data: SingleSelectFieldData;
    provider: CollectionProvider<Data>;
    onChange?: (_data: SingleSelectFieldData) => void;
    renderOption: (_entry: Entry) => ReactNode | null;
    canChooseNone?: boolean;
    readOnly?: boolean;
    name: string;
}
const SingleSelectField: FC<SingleSelectionFieldProps> = ({
    margin, // FormControl
    variant, // FormControl
    fullWidth, // FormControl
    size, // FormControl
    disabled, // FormControl
    label, // InputLabel

    data,
    provider,
    onChange,
    canChooseNone,
    renderOption,
    ...props
}) => {
    const hasErrorMessages = !!data.errorMessage;
    const labelId = `select-${props.name}-label`;
    const { t } = useTranslation();
    return (
        <FormControl
            margin={margin}
            variant={variant}
            fullWidth={fullWidth}
            size={size}
            disabled={disabled}
            error={hasErrorMessages}>
            {label && <InputLabel id={labelId}>{label}</InputLabel>}
            <Select
                labelId={labelId}
                chosenOption={data.chosenOption}
                options={provider.entries}
                onChange={(chosenOption) => onChange?.({ ...data, chosenOption })}
                canChooseNone={canChooseNone}
                renderOption={renderOption}
                {...props}
            />
            {data.errorMessage ? <FormHelperText>{t(data.errorMessage)}</FormHelperText> : null}
        </FormControl>
    );
};

export default SingleSelectField;
