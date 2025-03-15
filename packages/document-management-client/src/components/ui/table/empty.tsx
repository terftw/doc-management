import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { TableRow, useTheme } from '@mui/material';
import { TableCell } from '@mui/material';
import { alpha } from '@mui/material';
import { Typography } from '@mui/material';
import { Box } from '@mui/material';
import { ColumnDef } from '@tanstack/react-table';

export const TableEmpty = <T,>({
  columns,
  emptyMessage,
}: {
  columns: ColumnDef<T>[];
  emptyMessage: string;
}) => {
  const theme = useTheme();

  return (
    <TableRow>
      <TableCell
        colSpan={columns.length}
        sx={{
          padding: 4,
          textAlign: 'center',
          color: theme.palette.text.secondary,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <InsertDriveFileIcon
            sx={{ fontSize: 48, color: alpha(theme.palette.text.primary, 0.2) }}
          />
          <Typography variant="body1">{emptyMessage}</Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
};
