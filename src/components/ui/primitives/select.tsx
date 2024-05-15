import { type FC, type ReactNode, useMemo, useCallback } from 'react';
import MenuItem from '@mui/material/MenuItem';
import MuiSelect, { type SelectProps as MuiSelectProps } from '@mui/material/Select';
import { useTranslation } from 'react-i18next';
import type { Entry } from '@packages/core/collection';

interface SelectProps<Data = unknown> extends Omit<MuiSelectProps, 'onChange'> {
    name: string;
    labelId?: string;
    chosenOption: null | Entry<Data>;
    options: Entry<Data>[];
    renderOption: (_entry: Entry<Data>) => ReactNode;
    canChooseNone?: boolean;
    onChange?: (_option: null | Entry<Data>) => void;
}

const Select: FC<SelectProps> = ({ onChange, renderOption, chosenOption, canChooseNone, ...props }) => {
    const { t } = useTranslation();

    const options = useMemo(() => {
        const shouldChosenOptionBeAddedToOptions =
            !!chosenOption && !props.options.find((o) => o?.key === chosenOption?.key);
        const options =
            chosenOption && shouldChosenOptionBeAddedToOptions ? [chosenOption, ...props.options] : props.options;
        return options;
    }, [chosenOption, props.options]);

    const shouldNoneOptionBeShown = !chosenOption || canChooseNone;

    const getEntryByKeyOrNull = useCallback(
        (key: unknown): null | Entry => options.find((o) => o.key === key) ?? null,
        [options]
    );

    return (
        <MuiSelect
            inputProps={{
                id: props.name,
                name: props.name,
            }}
            id={props.name}
            value={chosenOption?.key ?? ''}
            onChange={({ target }) => {
                const entry = getEntryByKeyOrNull(target.value);
                onChange?.(entry);
            }}
            {...props}>
            {shouldNoneOptionBeShown ? (
                <MenuItem value="">
                    <em>{t('core.form.selection.choose')}</em>
                </MenuItem>
            ) : null}
            {options.map((o) => (
                <MenuItem key={o?.key} value={o?.key}>
                    {renderOption(o)}
                </MenuItem>
            ))}
        </MuiSelect>
    );
};

export default Select;
