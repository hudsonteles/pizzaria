import { Clear, MoreVert, Search } from "@mui/icons-material";
import { Checkbox, Divider, FormControlLabel, FormGroup, FormLabel, IconButton, Menu, Paper, TextField, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";

export function ListSearchBar({
    search, searchFields, setSearchFields, searchFieldsOptions, onSearch, placeholder
}: {
    search: string;
    searchFields: string[];
    setSearchFields: (v: string[]) => void;
    searchFieldsOptions: { field: string; label: string }[];
    onSearch: (clear: boolean, search: string) => void;
    placeholder: string;
}) {
    const [anchorRef, setAnchorRef] = useState<null | HTMLElement>(null);
    const [textSearch, setTextSearch] = useState(search);

    useEffect(() => {
        if (search !== textSearch) {
            setTextSearch(search);
        }
    }, [search]);

    const handleSearchFieldToggle = (field: string) => {
        if (searchFields.includes(field)) {
            setSearchFields(searchFields.filter((f: string) => f !== field));
        } else {
            setSearchFields([...searchFields, field]);
        }
    };

    const handleSelectAll = () => {
        if (searchFields.length === searchFieldsOptions.length) {
            setSearchFields([]);
        } else {
            setSearchFields(searchFieldsOptions.map(f => f.field));
        }
    };

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                onSearch(false, textSearch);
            }}
            style={{ display: "flex", width: "100%" }}
        >
            <Paper
                elevation={0}
                sx={{
                    px: 1,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #243881',
                    borderRadius: '10px 0 0 10px'
                }}
            >
                <TextField
                    sx={{
                        flex: 1,
                        '& .MuiInputBase-root': {
                            '& input': {
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            },
                            '& fieldset': {
                                background: 'transparent',
                                border: 'none'
                            }
                        }
                    }}
                    fullWidth
                    variant="outlined"
                    placeholder={placeholder}
                    value={textSearch}
                    onChange={e =>
                        setTextSearch(e.target.value)
                    }
                />
                {textSearch.length > 0 && (
                    <>
                        <IconButton
                            type="button"
                            onClick={() => {
                                setTextSearch("");
                                onSearch(true, "");
                            }}
                        >
                            <Clear />
                        </IconButton>
                        <Divider orientation="vertical" sx={{ height: '80%' }} />
                    </>
                )}
                <Tooltip title="Buscar">
                    <IconButton
                        type="submit"
                        sx={{ color: 'primary.main' }}
                        size="small"
                    >
                        <Search />
                    </IconButton>
                </Tooltip>
            </Paper>
            <Paper
                onClick={e => setAnchorRef(e.currentTarget)}
                elevation={0}
                sx={{
                    px: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: Boolean(anchorRef) ? '#0034b2' : '#243881',
                    borderRadius: '0 10px 10px 0',
                    color: 'white',
                    border: `1px solid ${Boolean(anchorRef) ? '#0034b2' : '#243881'}`,
                    '&:hover': {
                        cursor: 'pointer',
                        backgroundColor: '#0034b2',
                        borderColor: '#0034b2'
                    }
                }}
            >
                <MoreVert />
            </Paper>
            <Menu
                keepMounted
                elevation={0}
                open={anchorRef !== null}
                anchorEl={anchorRef}
                onClose={() => setAnchorRef(null)}
                sx={{
                    '& .MuiMenu-paper': {
                        mt: 2,
                        px: 2,
                        py: 0,
                        borderStyle: 'solid',
                        borderWidth: 1,
                        borderColor: 'primary.main',
                        borderRadius: 3
                    }
                }}
            >
                <FormGroup>
                    {searchFieldsOptions.length > 1 && (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={searchFields.length === searchFieldsOptions.length}
                                    color="primary"
                                    onChange={handleSelectAll}
                                />
                            }
                            label="Selecionar todos"
                        />
                    )}
                    {searchFieldsOptions.map((item, index) => (
                        <FormControlLabel
                            key={index}
                            control={
                                <Checkbox
                                    checked={searchFields.includes(item.field)}
                                    color="primary"
                                    onChange={() => handleSearchFieldToggle(item.field)}
                                    disabled={searchFieldsOptions.length === 1}
                                />
                            }
                            label={item.label}
                        />
                    ))}
                </FormGroup>
                {searchFields.length === 0 && (
                    <FormLabel component="legend" sx={{ color: "#f44336" }}>
                        Selecione ao menos uma opção
                    </FormLabel>
                )}
            </Menu>
        </form>
    );
}
