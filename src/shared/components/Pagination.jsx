import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function PaginationBar({ totalItems, itemsPerPage, page, onChange }) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <Stack spacing={2} alignItems="center" sx={{ my: 4 }}>
            <Pagination
                count={totalPages}
                page={page}
                onChange={onChange}
                variant="outlined"
                color="primary"
            />
        </Stack>
    );
}
