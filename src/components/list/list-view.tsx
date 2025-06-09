import AddIcon from "@mui/icons-material/Add";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Fab from "@mui/material/Fab";
import { ListFiltersTabs } from "./list-filters-tabs";
import { ListOrderMenu } from "./list-order-menu";
import { ListPagination } from "./list-pagination";
import { ListSearchBar } from "./list-search-bar";

export function ListView({
    loading,
    data,
    renderItem,
    renderSkeleton,
    searchBarProps,
    orderMenuProps,
    filtersTabsProps,
    paginationProps,
    meta,
    onCreate
}: any) {
    return (
        <Container
            maxWidth="md"
            sx={{
                mb: 2
            }}
        >
            <Stack spacing={1}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <ListSearchBar {...searchBarProps} />
                    <ListOrderMenu {...orderMenuProps} />
                </Stack>
                <ListFiltersTabs {...filtersTabsProps} />
                <Stack spacing={1}>
                    {loading
                        ? (renderSkeleton && renderSkeleton)
                        : data.length === 0 ? (
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                minHeight={220}
                                py={4}
                                gap={2}
                            >
                                <SearchOffIcon sx={{ fontSize: 56, color: "grey.400" }} />
                                <Typography variant="h6" color="text.secondary">
                                    Nenhum resultado encontrado
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Tente alterar os filtros ou a busca para encontrar o que procura.
                                </Typography>
                                {/* Opcional: botão para limpar filtros */}
                                {filtersTabsProps?.onClearFilters && (
                                    <Button
                                        variant="outlined"
                                        onClick={filtersTabsProps.onClearFilters}
                                        sx={{ mt: 1 }}
                                    >
                                        Limpar filtros e buscas
                                    </Button>
                                )}
                            </Box>
                        ) : (
                            data.map(renderItem)
                        )
                    }
                </Stack>
                {meta && (
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-end"
                    >
                        <ListPagination {...paginationProps} />
                    </Stack>
                )}
            </Stack>
            {
                onCreate &&
                    <Fab
                        color="primary"
                        aria-label="Adicionar"
                        onClick={onCreate}
                        sx={{
                            position: "fixed",
                            bottom: 32,
                            right: 32,
                            zIndex: 1200,
                        }}
                    >
                        <AddIcon />
                    </Fab>
            }
        </Container>
    );
}
