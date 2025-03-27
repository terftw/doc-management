import { formatDate } from '@/lib/date';
import { getPrettyFileSizeForTable } from '@/lib/file-data-processing';
import { Document } from '@/models/document';
import { Folder } from '@/models/folder';
import { FSEntry } from '@/models/fsentry';
import theme from '@/theme';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Chip, IconButton, Tooltip, Typography, alpha } from '@mui/material';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';

// Reusable styling constants
const TEXT_SECONDARY = { color: theme.palette.text.secondary };
const ELLIPSIS_TEXT = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export const useGetFSEntryTableColumns = (
  handleActionClick: (_event: React.MouseEvent<HTMLButtonElement>, _fsEntry: FSEntry) => void,
): ColumnDef<FSEntry>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
    size: 1000,
    cell: info => {
      const entry = info.row.original;
      const isFolder = entry.entryType === 'folder';
      const displayName = isFolder ? (entry as Folder).name : (entry as Document).name;

      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {isFolder ? (
            <FolderIcon sx={{ color: theme.palette.warning.main, fontSize: 24 }} />
          ) : (
            <InsertDriveFileIcon sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
          )}
          <Typography variant="body2" fontWeight={500} sx={ELLIPSIS_TEXT}>
            {displayName}
          </Typography>
        </Box>
      );
    },
  },
  {
    accessorKey: 'creator',
    header: 'Created by',
    size: 150,
    cell: info => {
      const creator = info.getValue();
      const name =
        creator && typeof creator === 'object' && 'name' in creator ? creator.name : null;

      return (
        <Typography variant="body2" sx={TEXT_SECONDARY}>
          {`${name ?? '-'}`}
        </Typography>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Date created',
    size: 150,
    cell: info => (
      <Typography variant="body2" sx={TEXT_SECONDARY}>
        {formatDate(info.getValue() as string)}
      </Typography>
    ),
  },
  {
    accessorKey: 'fileSize',
    header: 'Size',
    size: 150,
    cell: info => {
      const fileSize = info.getValue();
      const isFolder = info.row.original.entryType === 'folder';

      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {isFolder ? (
            <Chip
              label="Folder"
              size="small"
              sx={{
                backgroundColor: alpha(theme.palette.warning.main, 0.1),
                color: theme.palette.warning.dark,
                fontWeight: 500,
                fontSize: '0.75rem',
                borderRadius: '4px',
                paddingLeft: 0,
              }}
            />
          ) : (
            <Typography variant="body2" sx={TEXT_SECONDARY}>
              {getPrettyFileSizeForTable(fileSize as number)}
            </Typography>
          )}
          <Tooltip title="More options">
            <IconButton
              size="small"
              onClick={e => handleActionClick(e, info.row.original)}
              sx={TEXT_SECONDARY}
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      );
    },
  },
];
