'use client';

import { Box, Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

// Mapeie os segmentos para labels amigáveis
const breadcrumbMap: Record<string, string> = {
    logged: "Área Logada",
    superadmin: "Superadmin",
    "home": "Home",
    "users-system": "Usuários do Sistema",
    "create": "Novo",
    "profile": "Perfil do Usuário",
};

const DynamicBreadcrumbs = () => {
    const pathname = usePathname();
    const pathSegments = pathname.split("/").filter(Boolean);

    // Não mostra breadcrumbs na raiz
    if (pathSegments.length === 0) return null;

    const breadcrumbs = pathSegments.map((segment, idx) => {
        const href = "/" + pathSegments.slice(0, idx + 1).join("/");
        const label = breadcrumbMap[segment] || segment.replace(/-/g, " ");
        const isLast = idx === pathSegments.length - 1;
        return isLast ? (
            <Typography color="text.primary" fontWeight={600} key={href}>
                {label}
            </Typography>
        ) : (
            <MuiLink
                component={NextLink}
                underline="hover"
                color="inherit"
                href={href}
                key={href}
            >
                {label}
            </MuiLink>
        );
    });

    return (
        <Box sx={{ px: 0, py: 1 }}>
            <Breadcrumbs aria-label="breadcrumb">
                {breadcrumbs}
            </Breadcrumbs>
        </Box>
    );
};

export default DynamicBreadcrumbs;
