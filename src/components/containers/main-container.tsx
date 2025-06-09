'use client';

import { PageWrapper } from "@/components/containers/page-wrapper";
import { MainProvider } from "@/contexts/main";
import { Box } from "@mui/material";
import { blue, blueGrey, grey } from "@mui/material/colors";
import { ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material/styles";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Cookies from "js-cookie";
import 'moment/locale/pt-br';
import { ReactNode, createContext, useEffect, useMemo, useState } from "react";
import Flyer from "../loaders/flyer/flyer";

const ColorModeContext = createContext({ toggleColorMode: () => { } });

type Props = {
    children: ReactNode;
};

const MainContainer = ({ children }: Props) => {

    const [mode, setMode] = useState<any>(undefined);

    useEffect(() => {

        getModeColor()

    }, []);

    useEffect(() => {
        if (mode) {
            Cookies.set("mode-color", mode);
        }
    }, [mode]);

    const getModeColor = () => {
        if (Cookies.get("mode-color")) {
            setMode(Cookies.get("mode-color") as any);
        } else {
            setMode("light");
        }
    }

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode: any) => (prevMode === "light" ? "dark" : "light"));
            },
        }),
        []
    );

    let theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    ...(mode === "light"
                        ? {
                            // palette values for light mode
                            primary: {
                                main: 'rgba(36, 56, 129)'
                            },
                            secondary: {
                                main: '#30374F'
                            },
                            info: {
                                main: '#93A31C'
                            },
                            background: {
                                // default: grey[100],
                                paper: 'white'
                            },
                            text: {
                                primary: 'rgba(36, 56, 129)',
                                secondary: grey[800]
                            }
                        }
                        : {
                            // // palette values for dark mode
                            primary: {
                                main: blueGrey[50]
                            },
                            secondary: {
                                main: blue[400]
                            },
                            // info: {
                            //     main: teal[400]
                            // },
                            // error: {
                            //     main: red[800],
                            // },
                            background: {
                                // default: 'rgba(36, 56, 129)',
                                paper: grey[800],
                            },
                            // text: {
                            //     primary: grey[100],
                            //     secondary: 'rgba(36, 56, 129)'
                            // }
                        }),
                },
                breakpoints: {
                    values: {
                        xs: 0,
                        sm: 600,
                        md: 900,
                        lg: 1200,
                        xl: 1600,
                    },
                },
                components: {
                    MuiButton: {
                        styleOverrides: {
                            contained: {
                                borderRadius: "5px",
                            },
                            outlined: {
                                borderRadius: "5px",
                            },
                        },
                    },
                    MuiAvatar: {
                        styleOverrides: {
                            circular: {
                                color: "white"
                            }
                        }
                    }
                },
            }),
        [mode]
    );

    theme = responsiveFontSizes(theme);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider
                theme={theme}
            >
                <LocalizationProvider
                    dateAdapter={AdapterMoment}
                    adapterLocale="pt-BR"
                >
                    <MainProvider>
                        <PageWrapper>
                            <Box>
                                {
                                    mode ? (
                                        children
                                    ) : (
                                        <Flyer />
                                    )
                                }
                            </Box>
                        </PageWrapper>
                    </MainProvider>
                </LocalizationProvider>
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

export default MainContainer;
