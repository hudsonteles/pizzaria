'use client'

import CustomTextFieldStyle from "./custom-text-field-style"

type Props = {
    autoFocus?: boolean,
    name: string,
    label: string,
    tabIndex: number,
    formik: any,
    disabled?: boolean,
    type?: string,
    autoComplete?: string,
    InputProps?: {
        startAdornment?: React.ReactNode,
        endAdornment?: React.ReactNode,
        inputProps?: {
            min?: number,
            max?: number
        }
    },
    helperText?: string
}

const CustomTextField = ({
    autoFocus = false,
    name,
    label,
    tabIndex,
    formik,
    disabled = false,
    type = "text",
    autoComplete = "off",
    InputProps = {
        startAdornment: null,
        endAdornment: null,
        inputProps: {
            min: undefined,
            max: undefined
        }
    },
    helperText = null
}: Props) => {

    return (
        <CustomTextFieldStyle
            autoFocus={autoFocus}
            fullWidth
            id={name}
            name={name}
            label={label}
            variant="standard"
            type={type}
            autoComplete={autoComplete}
            disabled={disabled}
            tabIndex={tabIndex}
            InputProps={{ ...InputProps }}
            value={formik.values[name]}
            onChange={formik.handleChange}
            error={formik.touched[name] && Boolean(formik.errors[name])}
            helperText={helperText || (formik.touched[name] && formik.errors[name])}
        />
    )

}

export default CustomTextField
