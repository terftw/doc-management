import { TableCell } from '@mui/material';
import { TableRow } from '@mui/material';
import { alpha, useTheme } from '@mui/material';
import { Table, flexRender } from '@tanstack/react-table';

export const TableContent = <T,>({
  table,
  handleRowClick,
}: {
  table: Table<T>;
  handleRowClick?: (_: T) => void;
}) => {
  const theme = useTheme();

  return table.getRowModel().rows.map((row, index) => (
    <TableRow
      key={row.id}
      hover
      onClick={() => handleRowClick && handleRowClick(row.original)}
      sx={{
        cursor: handleRowClick ? 'pointer' : 'default',
        backgroundColor: index % 2 === 1 ? alpha(theme.palette.primary.main, 0.02) : 'transparent',
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
        },
        '& td': {
          borderBottom: `1px solid ${theme.palette.divider}`,
          padding: '10px 16px',
        },
      }}
    >
      {row.getVisibleCells().map(cell => (
        <TableCell
          key={cell.id}
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  ));
};
