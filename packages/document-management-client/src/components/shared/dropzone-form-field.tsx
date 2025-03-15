import { getFileExtension, getPrettyFileSize } from '@/lib/file-data-processing';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface DropzoneFormFieldProps {
  value?: File | null;
  onChange?: (_: File | null) => void;
  error?: boolean;
  helperText?: string;
}

const DropzoneFormField = ({ value, onChange, error, helperText }: DropzoneFormFieldProps) => {
  const theme = useTheme();
  const fileToDisplay = value;

  const handleFileChange = useCallback(
    (file: File | null) => {
      if (onChange) {
        onChange(file);
      }
    },
    [onChange],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Only one file is allowed
      if (acceptedFiles.length > 0) {
        handleFileChange(acceptedFiles[0]);
      }
    },
    [handleFileChange],
  );

  const removeFile = useCallback(() => {
    handleFileChange(null);
  }, [handleFileChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    maxSize: 1048576,
  });

  return (
    <Box sx={{ width: '100%', my: 2 }}>
      <Paper
        {...getRootProps()}
        sx={{
          padding: theme.spacing(3),
          textAlign: 'center',
          cursor: 'pointer',
          border: `2px dashed ${theme.palette.primary.main}`,
          backgroundColor: theme.palette.background.default,
          transition: 'border .24s ease-in-out',
          width: '100% !important',
          borderColor: error ? 'error.main' : 'primary.main',
          '&:hover': {
            borderColor: error ? 'error.dark' : 'primary.dark',
          },
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Box
            sx={{
              backgroundColor: theme.palette.primary.light,
              opacity: 0.6,
              padding: theme.spacing(8),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" color="primary">
              Drop files here...
            </Typography>
          </Box>
        ) : (
          <Box sx={{ py: 4 }}>
            <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Drag 'n' drop files here
            </Typography>
            <Typography variant="body2" color="textSecondary">
              or click to select files
            </Typography>
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
              Supported formats: PDF, DOCX, PPTX, XLSX, CSV (Single file only)
            </Typography>
          </Box>
        )}
      </Paper>

      {fileToDisplay && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            File selected
          </Typography>

          <List>
            <ListItem
              secondaryAction={
                <IconButton edge="end" onClick={removeFile}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemIcon>
                <InsertDriveFileIcon />
              </ListItemIcon>
              <ListItemText
                primary={fileToDisplay.name}
                secondary={`${getFileExtension(fileToDisplay.name)} • ${getPrettyFileSize(fileToDisplay.size)}`}
              />
            </ListItem>
          </List>
        </Box>
      )}

      {error && helperText && (
        <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default DropzoneFormField;
