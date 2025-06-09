"use client";

import { useMain } from "@/contexts/main";
import api from "@/services/api";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import { Avatar, Collapse, ListItemButton, ListItemText, Slide, Stack, Tooltip } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import Alert from "../alert/alert";
import { menu } from "../menu/menu";

const DRAWER_WIDTH_EXPANDED = 220;
const DRAWER_WIDTH_COLLAPSED = 60;

type Props = {
    children: React.ReactNode;
    toggleColorMode: () => void;
};


const ResponsiveNavBar = ({ children, toggleColorMode }: Props) => {

    const { swal } = useMain();
    const { data: session } = useSession();
    const router = useRouter();

    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState('');
    const [submenuOpen, setSubmenuOpen] = React.useState({});
    const [anchorEl, setAnchorEl] = React.useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    // Lidar com subir/fechar submenus
    const handleSubmenuToggle = (idx) => {
        if (!sidebarOpen) {
            setSidebarOpen(true);
        }
        setSubmenuOpen((prev) => ({
            ...prev,
            [idx]: !prev[idx]
        }));
    };

    const handleDrawerToggle = () => { setMobileOpen(!mobileOpen); };
    const handleMenuClick = (e) => setAnchorEl(() => Boolean(anchorEl) ? null : e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleSelect = (idx) => {
        setSelectedIndex(idx);
        setMobileOpen(false);
        // Navegação real pode ser feita via react-router ou similar
    };

    const handleSidebarExpand = () => setSidebarOpen(true);
    const handleSidebarCollapse = () => setSidebarOpen(false);

    const handleLogout = async () => {

        handleMenuClose();

        swal.fire({
            title:
                <Typography
                    variant="h5"
                >
                    Realmente deseja sair?
                </Typography>,
            icon: 'question',
            confirmButtonText: 'Sim',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                swal.getConfirmButton()?.focus();
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                api((session?.user as any)?.accessToken).get('/auth/logout').then(async (response) => {
                    new Alert({}).showAlert({
                        type: 'success',
                        message: response.data.message
                    })

                    await signOut({ callbackUrl: "/auth/login" });
                }).catch((error) => {

                }).then(() => {

                });
            }
        })
    }

    const SidebarContent = (
        <Box
            sx={{
                height: "100%",
                bgcolor: "#222A36",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                position: "relative",
                width: sidebarOpen ? DRAWER_WIDTH_EXPANDED : DRAWER_WIDTH_COLLAPSED,
                minWidth: sidebarOpen ? DRAWER_WIDTH_EXPANDED : DRAWER_WIDTH_COLLAPSED,
                transition: "width 0.25s cubic-bezier(.4,0,.2,1)",
                overflowX: "hidden",   // Prevenir scroll horizontal
                boxShadow: "2px 0 4px 0 rgba(34,42,54,.05)"
            }}
        >
            {/* TOPO DA SIDEBAR */}
            <Box
                sx={{
                    height: 70,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: sidebarOpen ? "space-between" : "center",
                    px: 2,
                    pt: 1,
                    pb: 1
                }}
            >
                {!sidebarOpen && (
                    // Menu hamburger centralizado no topo na sidebar retraída
                    <IconButton
                        onClick={handleSidebarExpand}
                        sx={{
                            color: "#00B6FF",
                            bgcolor: "#232a34",
                            "&:hover": { bgcolor: "#1f2530" }
                        }}
                        size="large"
                        aria-label="abrir menu"
                    >
                        <MenuIcon />
                    </IconButton>
                )}
                {sidebarOpen && (
                    <>
                        <Box
                            sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                            <Avatar sx={{ bgcolor: "#00B6FF", width: 44, height: 44, fontWeight: 800, fontSize: 24 }}>
                                H
                            </Avatar>
                            <Typography variant="h6" sx={{ color: "#B0B8C1", fontWeight: 700, ml: 1 }}>

                            </Typography>
                        </Box>
                        <IconButton
                            onClick={handleSidebarCollapse}
                            sx={{
                                color: "#00B6FF",
                                bgcolor: "#232a34",
                                ml: 1,
                                "&:hover": { bgcolor: "#1f2530" }
                            }}
                            size="large"
                            aria-label="Retrair menu"
                        >
                            <ChevronLeftIcon />
                        </IconButton>
                    </>
                )}
            </Box>
            <Divider sx={{ borderColor: "#2e3542", mx: sidebarOpen ? 1 : 0 }} />
            {/* Lista de opções */}
            {/* Lista de opções e submenus */}
            <List sx={{ flexGrow: 1, width: "100%", mt: 1 }}>
                {menu.map((item, idx) => {
                    const hasSubmenu = !!item.submenus;
                    const isSubmenuOpen = submenuOpen[idx];

                    return (
                        <Box key={item.text} sx={{ width: '100%' }}>
                            <Tooltip
                                title={!sidebarOpen ? item.text : ""}
                                placement="right"
                                arrow
                            >
                                <ListItem disablePadding sx={{ display: "block" }}>
                                    <ListItemButton
                                        onClick={() => {
                                            if (hasSubmenu) {
                                                handleSubmenuToggle(idx);
                                            } else {
                                                handleSelect(idx);
                                                router.push(item.path);
                                            }
                                        }}
                                        selected={`${selectedIndex}` == `${idx}`}
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: sidebarOpen ? "flex-start" : "center",
                                            px: 2.5,
                                            borderLeft: selectedIndex == `${idx}` ? "4px solid #00B6FF" : "4px solid transparent",
                                            background: selectedIndex == `${idx}` ? "rgba(0,182,255,0.1)" : "transparent",
                                            "&:hover": { background: hasSubmenu ? "rgba(0,182,255,0.04)" : "rgba(0,182,255,0.08)" },
                                            transition: "all 0.2s"
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                justifyContent: "center",
                                                color: "#fff",
                                                mr: sidebarOpen ? 2 : 0
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>
                                        <Collapse orientation="horizontal" in={sidebarOpen}>
                                            <Stack direction="row" alignItems="center" justifyContent={"flex-end"} sx={{ width: "100%" }}>
                                                <ListItemText primary={item.text} />
                                                {hasSubmenu && (isSubmenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
                                            </Stack>
                                        </Collapse>
                                    </ListItemButton>
                                </ListItem>
                            </Tooltip>
                            {/* SUBMENUS apenas quando expandido */}
                            {hasSubmenu && sidebarOpen && (
                                <Collapse in={isSubmenuOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {item.submenus.map((sub, subIdx) => (
                                            <ListItemButton
                                                key={sub.text}
                                                sx={{
                                                    pl: 5,
                                                    background: "rgba(0,182,255,0.08)",
                                                    "&:hover": {
                                                        background: "rgba(0,182,255,0.14)"
                                                    },
                                                    color: selectedIndex == `${idx}-${subIdx}` ? "#00B6FF" : "#fff"
                                                }}
                                                onClick={() => {
                                                    setSelectedIndex(`${idx}-${subIdx}`);
                                                    setMobileOpen(false);
                                                }}
                                                selected={selectedIndex == `${idx}-${subIdx}`}
                                            >
                                                <ListItemText primary={sub.text} sx={{ fontSize: "0.95em" }} />
                                            </ListItemButton>
                                        ))}
                                    </List>
                                </Collapse>
                            )}
                        </Box>
                    );
                })}
            </List>
            {/* Sair */}
            <Box sx={{ pb: 2, display: "flex", justifyContent: "center" }}>
                <Tooltip title={!sidebarOpen ? "Sair" : ""} placement="right">
                    <ListItemButton
                        onClick={handleLogout}
                        sx={{
                            justifyContent: sidebarOpen ? "flex-start" : "center",
                            px: 2.5,
                            color: "#b0b8c1",
                            width: "100%",
                            textAlign: "center"
                        }}
                    >
                        <ListItemIcon sx={{ color: "#b0b8c1", minWidth: 0, mr: sidebarOpen ? 2 : 0 }}>
                            <LogoutIcon />
                        </ListItemIcon>
                        <Collapse orientation="horizontal" in={sidebarOpen}>
                            <ListItemText primary="Sair" />
                        </Collapse>
                    </ListItemButton>
                </Tooltip>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f7f9fb", overflowX: "hidden" }}>
            <CssBaseline />
            {/* AppBar */}
            <AppBar
                position="fixed"
                elevation={1}
                sx={{
                    width: {
                        md: `calc(100% - ${(sidebarOpen ? DRAWER_WIDTH_EXPANDED : DRAWER_WIDTH_COLLAPSED)}px)`
                    },
                    ml: {
                        md: (sidebarOpen ? `${DRAWER_WIDTH_EXPANDED}px` : `${DRAWER_WIDTH_COLLAPSED}px`)
                    },
                    bgcolor: "#fff",
                    color: "#222A36",
                    boxShadow: "0 2px 8px 0 rgba(34,42,54,.05)",
                    transition: "width 0.25s cubic-bezier(.4,0,.2,1), margin-left 0.25s cubic-bezier(.4,0,.2,1)"
                }}
            >
                <Toolbar>
                    {isMobile && (
                        <IconButton color="inherit" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent={{
                            xs: "center",
                            md: "flex-start"
                        }}
                        sx={{
                            flexGrow: 1
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 'bold',
                            }}
                        >
                            Plataforma
                        </Typography>
                    </Stack>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-end"
                    >
                        {!isMobile && (
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 'bold'
                                }}
                            >
                                {`Olá ${session?.user?.name}`}
                            </Typography>
                        )}
                        <IconButton
                            sx={{
                                color: 'inherit',
                            }}
                            onClick={handleMenuClick}
                        >
                            <Avatar src=""/>
                        </IconButton>
                    </Stack>
                    <Menu
                        elevation={0}
                        sx={{
                            zIndex: '1099',
                            mt: `47px`,
                            '& .MuiPaper-root': {
                                // width: '165px',
                                borderRadius: '0 0 10px 10px',
                                '& .MuiList-root': {
                                    py: 0,
                                    '& .MuiMenuItem-root': {
                                        py: 1.5,
                                        color: `'primary.main'`,
                                        '& .MuiTypography-root': {
                                            width: '100%'
                                        }
                                    },
                                    '& .MuiDivider-root': {
                                        my: 0
                                    }
                                }
                            }
                        }}
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                        }}
                        TransitionComponent={Slide}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={() => {
                            handleMenuClose();
                            // Navegação para a página de perfil
                            router.push("/profile");
                        }}>
                            Meu Perfil
                        </MenuItem>
                        {
                            (session?.user as any)?.group === 'superadmin' && (
                                <Box>
                                    <Divider />
                                    <MenuItem
                                        onClick={() => {
                                            handleMenuClose();
                                            router.push("/users-system");
                                        }}
                                    >
                                        <SupervisedUserCircleIcon fontSize="small" sx={{ mr: 1 }} />
                                        <Typography
                                            textAlign="left"
                                        >
                                            Usuários de Sistema
                                        </Typography>
                                    </MenuItem>
                                </Box>
                            )
                        }
                        <Divider />
                        <MenuItem onClick={handleLogout}>
                            <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                            Sair
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* SIDEBAR */}
            <Box
                component="nav"
                sx={{
                    width: { md: sidebarOpen ? DRAWER_WIDTH_EXPANDED : DRAWER_WIDTH_COLLAPSED },
                    flexShrink: { md: 0 },
                    overflowX: "hidden"
                }}
                aria-label="sidebar"
            >
                {/* Drawer mobile */}
                <Drawer
                    variant={isMobile ? "temporary" : "permanent"}
                    open={isMobile ? mobileOpen : true}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: "block", md: "block" },
                        "& .MuiDrawer-paper": {
                            width: sidebarOpen ? DRAWER_WIDTH_EXPANDED : DRAWER_WIDTH_COLLAPSED,
                            boxSizing: "border-box",
                            transition: "width 0.25s cubic-bezier(.4,0,.2,1)",
                            overflowX: "hidden",
                        }
                    }}
                >
                    {SidebarContent}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 2, md: 2 },
                    pt: { xs: 8, md: 8 },
                    width: "100%",
                    minHeight: "100vh",
                    overflowX: "hidden"
                }}
            >
                {children}
            </Box>
        </Box>
    );

}

export default ResponsiveNavBar;
