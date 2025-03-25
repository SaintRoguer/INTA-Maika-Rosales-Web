import React from 'react';
import { Box, TextField, MenuItem } from '@mui/material';
import { Controller } from 'react-hook-form';


export default function Inputs({ control, roles }) {
  const roles_map = []
  for (let i = 0; i < roles.length; i++) {
    roles_map.push({ value: roles[i], label: roles[i] });
  }

  return (
    <Box
      component="form"
      sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
      noValidate
      autoComplete="off"
    >
      <div>
        <Controller
          name="name"
          control={control}
          rules={{ required: 'El nombre es requerido' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Nombre"
              variant="standard"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          rules={{
            required: 'Email es requerido',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Email inválido',
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Email"
              variant="standard"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={{
            required: 'La contraseña es requerida',
            minLength: {
              value: 6,
              message: 'La contraseña debe tener al menos 6 caracteres',
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Contraseña"
              variant="standard"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />

        <Controller
          name="role"
          control={control}
          defaultValue="common"
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Rol"
              variant="standard"
              disabled
            >
              {roles_map.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </div>
    </Box>
  );
}