import { styled, TextField, TextFieldProps } from "@mui/material";

const CustomTextFieldStyle : any = styled(
    TextField, {
        name: "CustomTextField",
        slot: "Root",
        overridesResolver: (_props, styles) => [styles.root]
    }
)<TextFieldProps>
(
    ({ theme }) => ({
        '& label': {
            // transform: 'none',
            // position: 'unset',
            // textAlign: 'start',
            // marginBottom: '6px',
            // zIndex: 0,
            color: theme.palette.primary.main
        },
        // '& .Mui-focused': {
        //     fontWeight: '600'
        // },
        // '& .MuiOutlinedInput-root > fieldset > legend': {
        //     display: 'none'
        // },
        // '& .MuiFormHelperText-root': {
        //     marginLeft: 0,
        //     marginRight: 0
        // },
        // '& .MuiSvgIcon-root': {
        //     zIndex: 1
        // },
        // '& input': {
        //     zIndex: 1
        // },
        // '& fieldset': {
        //     background: theme.palette.mode === 'dark' ? alpha(grey[100], 0.5) : alpha(theme.palette.primary.main, 0.2),
        //     borderRadius: '5px'
        // }
    })
);

export default CustomTextFieldStyle;
