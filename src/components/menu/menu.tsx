import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";

export const menu = [
    {
        text: "Home",
        icon: <HomeIcon />,
        path: "/home"
    },
    {
        text: "Configurações",
        icon: <SettingsIcon />,
        submenus: [
            { text: "Perfil" }
        ]
    }
];
