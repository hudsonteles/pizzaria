import { TablePagination } from "@mui/material";

export function ListPagination({
    count,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange
}: {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (newPage: number) => void;
    onRowsPerPageChange: (newLimit: number) => void;
}) {
    return (
        <TablePagination
            count={count}
            page={page}
            onPageChange={(_event, newPage) => onPageChange(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={e => onRowsPerPageChange(Number(e.target.value))}
            labelRowsPerPage="Registros por página"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
    );
}
