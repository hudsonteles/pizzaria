import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { Box, Menu, MenuItem, Tab, Tabs, useTheme } from "@mui/material";
import { useState } from "react";

export function ListFiltersTabs({
    filters,
    filtersParam,
    subfilterLabels,
    onTabClick,
    onSubfilterClick
}: {
    filters: any[];
    filtersParam: string;
    subfilterLabels: { [key: number]: string };
    onTabClick: (filter: any, idx: number, event: React.MouseEvent<HTMLElement>) => void;
    onSubfilterClick: (subfilter: any, idx: number) => void;
}) {

    const theme = useTheme();
    const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

    const handleTabClick = (filter: any, idx: number, event: React.MouseEvent<HTMLElement>) => {
        if (filter.subfilters) {
            setFilterMenuAnchor(event.currentTarget);
            setOpenMenuIndex(idx);
        } else {
            onTabClick(filter, idx, event);
        }
    };

    return (
        <>
            <Tabs
                value={filtersParam.length === 0 ? "" : false}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                    mt: '0px !important',
                    alignItems: 'center',
                    '& .MuiTabScrollButton-root': {
                        color: 'primary.main',
                        height: '26px',
                        width: 'auto'
                    },
                    '& .MuiTabs-scroller': {
                        display: 'flex',
                        alignItems: 'center',
                        '& .MuiTabs-flexContainer': {
                            '& .MuiButtonBase-root:hover': {
                                backgroundColor: 'white',
                                color: 'primary.main'
                            },
                            '& .MuiButtonBase-root': {
                                padding: `5px 9px`,
                                marginRight: 1,
                                minHeight: '26px',
                                minWidth: 'auto',
                                borderRadius: '60px',
                                border: `1px solid ${theme.palette.primary.main}`,
                                color: 'primary.main',
                                '&:hover': {
                                    color: `${theme.palette.primary.main} !important`,
                                    backgroundColor: theme.palette.action.hover
                                }
                            },
                            '& .Mui-selected': {
                                backgroundColor: 'primary.main',
                                color: 'white !important'
                            }
                        },
                        '& .MuiTabs-indicator': {
                            display: 'none'
                        }
                    }
                }}
            >
                {filters.map((filter, idx) => {
                    if (filter.subfilters) {
                        const groupQueries = filter.subfilters.map((s: any) => s.query);
                        const selected = filtersParam.split(";").some((f) => groupQueries.includes(f));
                        return (
                            <Tab
                                key={idx}
                                value={`subfilter-${idx}`}
                                label={
                                    <Box display="flex" alignItems="center">
                                        {subfilterLabels[idx] || filter.label}
                                        {openMenuIndex === idx ? (
                                            <ArrowDropUpIcon fontSize="small" sx={{ ml: 0.5 }} />
                                        ) : (
                                            <ArrowDropDownIcon fontSize="small" sx={{ ml: 0.5 }} />
                                        )}
                                    </Box>
                                }
                                onClick={e => handleTabClick(filter, idx, e)}
                                sx={{
                                    backgroundColor: selected ? "primary.main" : undefined,
                                    color: selected ? "white !important" : undefined,
                                    borderRadius: "60px",
                                }}
                                aria-selected={selected}
                            />
                        );
                    }
                    const selected = filtersParam.split(";").includes(filter.query);
                    return (
                        <Tab
                            key={idx}
                            value={filter.query}
                            label={filter.label}
                            onClick={e => onTabClick(filter, idx, e)}
                            sx={{
                                backgroundColor: selected ? "primary.main" : undefined,
                                color: selected ? "white !important" : undefined,
                                borderRadius: "60px"
                            }}
                            aria-selected={selected}
                        />
                    );
                })}
            </Tabs>
            <Menu
                anchorEl={filterMenuAnchor}
                open={filterMenuAnchor !== null}
                onClose={() => {
                    setFilterMenuAnchor(null);
                    setOpenMenuIndex(null);
                }}
            >
                {openMenuIndex !== null && filters[openMenuIndex]?.subfilters?.map((subfilter: any, subIdx: number) => (
                    <MenuItem
                        key={subIdx}
                        selected={filtersParam.split(";").includes(subfilter.query)}
                        onClick={() => {
                            onSubfilterClick(subfilter, openMenuIndex);
                            setFilterMenuAnchor(null);
                            setOpenMenuIndex(null);
                        }}
                    >
                        {subfilter.label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}
