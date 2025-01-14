import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import { inputBaseClasses } from '@mui/material/InputBase';




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
        slotprops={{
          htmlInput: {
            sx: { textAlign: 'right' },
          },
          input: {
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{
                  alignSelf: 'flex-end',
                  margin: 0,
                  marginBottom: '5px',
                  opacity: 0,
                  pointerEvents: 'none',
                  [`[data-shrink=true] ~ .${inputBaseClasses.root} > &`]: {
                    opacity: 1,
                  },
                }}
              >
              </InputAdornment>
            ),
          },
        }}
      />
       <TextField
        id="email"
        label="Email"
        variant="standard"
        onChange={(e) => onInputChange('email', e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
        slotprops={{
          htmlInput: {
            sx: { textAlign: 'right' },
          },
          input: {
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{
                  alignSelf: 'flex-end',
                  margin: 0,
                  marginBottom: '5px',
                  opacity: 0,
                  pointerEvents: 'none',
                  [`[data-shrink=true] ~ .${inputBaseClasses.root} > &`]: {
                    opacity: 1,
                  },
                }}
              >
              </InputAdornment>
            ),
          },
        }}
      />
        <TextField
        id="password"
        label="Contraseña"
        onChange={(e) => onInputChange('password', e.target.value)}
        error={!!errors.password}
        helperText={errors.password}
        variant="standard"
        slotprops={{
          htmlInput: {
            sx: { textAlign: 'right' },
          },
          input: {
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{
                  alignSelf: 'flex-end',
                  margin: 0,
                  marginBottom: '5px',
                  opacity: 0,
                  pointerEvents: 'none',
                  [`[data-shrink=true] ~ .${inputBaseClasses.root} > &`]: {
                    opacity: 1,
                  },
                }}
              >
              </InputAdornment>
            ),
          },
        }}
      />
         <TextField
          id="role"
          select
          error={!!errors.role}
          helperText={errors.role}
          disabled
          label="Rol"
          defaultValue="common"
          variant="standard"
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
