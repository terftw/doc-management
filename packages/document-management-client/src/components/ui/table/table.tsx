import {
  Table as MuiTable,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  alpha,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { TableContent } from './content';
import { TableEmpty } from './empty';
import { Pagination } from './pagination';
import { TableSkeleton } from './skeleton';
import { TableRowMenu } from './table-row-menu';
import { TableRowMenuItems } from './types';

type TableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  totalItems: number;
  pageSize: number;
  page?: number;
  isLoading?: boolean;
  emptyMessage?: string;
  handleRowClick?: (_row: T) => void;
  handlePageChange?: (_event: React.MouseEvent<HTMLButtonElement> | null, _page: number) => void;
  handleRowsPerPageChange?: (_event: React.ChangeEvent<HTMLInputElement>) => void;
  rowsPerPageOptions?: number[];
  anchorEl: HTMLElement | null;
  handleMenuClose: () => void;
  menuItems: TableRowMenuItems[];
};

export const Table = <T,>({
  data,
  columns,
  totalItems,
  pageSize,
  page = 1,
  isLoading = false,
  emptyMessage = 'No items available',
  handleRowClick,
  handlePageChange,
  handleRowsPerPageChange,
  rowsPerPageOptions = [5, 10],
  anchorEl,
  handleMenuClose,
  menuItems,
}: TableProps<T>) => {
  const theme = useTheme();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(totalItems / pageSize),
  });

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      <TableContainer>
        <MuiTable sx={{ minWidth: 650, tableLayout: 'fixed' }}>
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow
                key={headerGroup.id}
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.02),
                }}
              >
                {headerGroup.headers.map(header => (
                  <TableCell
                    key={header.id}
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: theme.palette.text.secondary,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      padding: '12px 16px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableSkeleton<T> pageSize={pageSize} columns={columns} />
            ) : data.length === 0 ? (
              <TableEmpty<T> columns={columns} emptyMessage={emptyMessage} />
            ) : (
              <TableContent<T> table={table} handleRowClick={handleRowClick} />
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>
      <Pagination
        handlePageChange={handlePageChange}
        handleRowsPerPageChange={handleRowsPerPageChange}
        totalItems={totalItems}
        page={page}
        pageSize={pageSize}
        rowsPerPageOptions={rowsPerPageOptions}
      />

      <TableRowMenu anchorEl={anchorEl} handleClose={handleMenuClose} menuItems={menuItems} />
    </Paper>
  );
};
