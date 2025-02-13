import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';

const roles = [
  {
    value: 'common',
    label: 'Comun',
  },
  {
    value: 'admin',
    label: 'Admin',
  },
];

export default function Inputs({ onInputChange, errors }) {
  return (
    <Box
      component="form"
      sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          id="name"
          label="Nombre"
          variant="standard"
          onChange={(e) => onInputChange('name', e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{
                  alignSelf: 'flex-end',
                  margin: 0,
                  marginBottom: '5px',
                  opacity: 0,
                  pointerEvents: 'none',
                }}
              />
            ),
          }}
        />
        <TextField
          id="email"
          label="Email"
          variant="standard"
          onChange={(e) => onInputChange('email', e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{
                  alignSelf: 'flex-end',
                  margin: 0,
                  marginBottom: '5px',
                  opacity: 0,
                  pointerEvents: 'none',
                }}
              />
            ),
          }}
        />
        <TextField
          id="password"
          label="Contraseña"
          variant="standard"
          onChange={(e) => onInputChange('password', e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{
                  alignSelf: 'flex-end',
                  margin: 0,
                  marginBottom: '5px',
                  opacity: 0,
                  pointerEvents: 'none',
                }}
              />
            ),
          }}
        />
        <TextField
          id="role"
          select
          label="Rol"
          defaultValue="common"
          variant="standard"
          error={!!errors.role}
          helperText={errors.role}
          disabled
        >
          {roles.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
    </Box>
  );
}