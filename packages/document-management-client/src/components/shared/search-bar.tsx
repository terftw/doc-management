import { Search as SearchIcon } from '@mui/icons-material';
import { Box } from '@mui/material';
import { TextField } from '@mui/material';
import { InputAdornment } from '@mui/material';
import React from 'react';

const SearchBar = ({ value, onChange }: { value: string; onChange: (_: string) => void }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <Box sx={{ p: 2, paddingLeft: 0 }}>
      <TextField
        placeholder="Search"
        variant="outlined"
        size="small"
        sx={{ width: '300px' }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
        value={value}
        onChange={handleChange}
      />
    </Box>
  );
};

export default SearchBar;
