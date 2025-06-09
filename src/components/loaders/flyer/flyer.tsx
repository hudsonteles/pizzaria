import { Box, Stack, Typography } from "@mui/material";
import "./style.css";

type Props = {
    text?: string,
}

export default function Flyer({
    text = 'Carregando sistema'
}: Props) {
    return (
        <div className="frame">
            <Stack
                className="frame"
                direction="column"
                justifyContent="center"
                alignItems="center"
                height="100vh"
                spacing={10}
            >
                <Box
                    className="body"
                    sx={{
                        left: {
                            xs: "38%",
                            md: "46%",
                        },
                    }}
                >
                    <span>
                        <span />
                        <span />
                        <span />
                        <span />
                    </span>
                    <div className="base">
                        <span />
                        <div className="face"></div>
                    </div>
                </Box>
                <div className="longfazers">
                    <span />
                    <span />
                    <span />
                    <span />
                </div>
                <Typography variant="h5" fontWeight="bold" color="white">
                    {text}
                </Typography>
            </Stack>
        </div>
    );
}
