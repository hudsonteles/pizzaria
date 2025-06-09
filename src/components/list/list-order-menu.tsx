import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Button, Divider, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

export function ListOrderMenu({
    orderFields,
    orderBy,
    sortedBy,
    onOrderChange,
    onDirChange
}: {
    orderFields: { value: string; label: string }[];
    orderBy: string;
    sortedBy: "asc" | "desc";
    onOrderChange: (field: string) => void;
    onDirChange: (dir: "asc" | "desc") => void;
}) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    return (
        <>
            <Button
                variant="outlined"
                onClick={e => setAnchorEl(e.currentTarget)}
                endIcon={sortedBy === "asc" ? <ArrowDownwardIcon fontSize="small" /> : <ArrowUpwardIcon fontSize="small" />}
                sx={{
                    whiteSpace: "nowrap",
                    px: 3
                }}
            >
                {orderFields.find(f => f.value === orderBy)?.label}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                MenuListProps={{ dense: true }}
            >
                {orderFields.map((field) => (
                    <MenuItem
                        key={field.value}
                        selected={orderBy === field.value}
                        onClick={() => { onOrderChange(field.value); setAnchorEl(null); }}
                    >
                        {field.label}
                    </MenuItem>
                ))}
                <Divider />
                <MenuItem
                    selected={sortedBy === "asc"}
                    onClick={() => { onDirChange("asc"); setAnchorEl(null); }}
                >
                    <ListItemIcon>
                        <ArrowDownwardIcon fontSize="small" />
                    </ListItemIcon>
                    Ascendente
                </MenuItem>
                <MenuItem
                    selected={sortedBy === "desc"}
                    onClick={() => { onDirChange("desc"); setAnchorEl(null); }}
                >
                    <ListItemIcon>
                        <ArrowUpwardIcon fontSize="small" />
                    </ListItemIcon>
                    Descendente
                </MenuItem>
            </Menu>
        </>
    );
}
