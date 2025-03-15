import { TablePagination, Typography, alpha, useTheme } from '@mui/material';
import { Box } from '@mui/material';

export const Pagination = ({
  handlePageChange,
  handleRowsPerPageChange,
  totalItems,
  page,
  pageSize,
  rowsPerPageOptions,
}: {
  handlePageChange?: (_event: React.MouseEvent<HTMLButtonElement> | null, _page: number) => void;
  handleRowsPerPageChange?: (_: React.ChangeEvent<HTMLInputElement>) => void;
  totalItems: number;
  page: number;
  pageSize: number;
  rowsPerPageOptions: number[];
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: alpha(theme.palette.background.default, 0.5),
      }}
    >
      <Box sx={{ pl: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </Typography>
      </Box>
      {handlePageChange && (
        <TablePagination
          component="div"
          count={totalItems}
          page={page - 1} // Convert 1-based to 0-based
          onPageChange={handlePageChange}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={rowsPerPageOptions}
          sx={{
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontSize: '0.875rem',
            },
          }}
        />
      )}
    </Box>
  );
};
