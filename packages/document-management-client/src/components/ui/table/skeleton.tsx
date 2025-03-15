import { Skeleton } from '@mui/material';
import { TableCell } from '@mui/material';
import { TableRow } from '@mui/material';
import { ColumnDef } from '@tanstack/react-table';

export const TableSkeleton = <T,>({
  pageSize,
  columns,
}: {
  pageSize: number;
  columns: ColumnDef<T>[];
}) => {
  return (
    <>
      {[...Array(pageSize)].map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          {columns.map((_, cellIndex) => (
            <TableCell key={`cell-${index}-${cellIndex}`}>
              <Skeleton
                variant="text"
                width={cellIndex === 0 ? '70%' : '60%'}
                height={20}
                animation="wave"
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};
