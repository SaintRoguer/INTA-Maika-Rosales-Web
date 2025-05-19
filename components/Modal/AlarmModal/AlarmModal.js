import React from 'react';
import { Modal, Box, TextField } from '@mui/material';
import MDButton from 'components/MDButton';
import { useMaterialUIController } from 'context';
import { useForm, Controller } from 'react-hook-form';

export default function AlarmModal({ open, onClose, onSubmit, windVelocity, soilSensitivity, loteDetailId }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      windVelocity: windVelocity || 0,
      soilSensitivity: soilSensitivity || 0
    }
  });

  const handleFormSubmit = (data) => {
    onSubmit(data.windVelocity, data.soilSensitivity, loteDetailId);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        component="form"
        onSubmit={handleSubmit(handleFormSubmit)}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: !darkMode ? 'background.paper' : 'rgba(31, 40, 62, 1)',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Controller
          name="windVelocity"
          control={control}
          rules={{ 
            required: 'Este campo es requerido',
            min: { value: 0, message: 'El valor debe ser positivo' }
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Velocidad del Viento (km/h)"
              type="number"
              error={!!errors.windVelocity}
              helperText={errors.windVelocity?.message}
              inputProps={{ min: 0, step: "0.1" }}
            />
          )}
        />

        <Controller
            name="soilSensitivity"
            control={control}
            rules={{ 
                required: 'Este campo es obligatorio',
                min: { 
                value: 0, 
                message: 'La sensibilidad no puede ser menor que 0' 
                },
                max: { 
                value: 5, 
                message: 'La sensibilidad no puede ser mayor que 5' 
                },
                validate: {
                isInteger: value => 
                    Number.isInteger(Number(value)) || 'Debe ser un número entero (sin decimales)',
                noDecimal: value => 
                    !value.toString().includes('.') || 'Elimine los decimales'
                }
            }}
            render={({ field }) => (
                <TextField
                {...field}
                label="Sensibilidad del Suelo (0-5)"
                type="number"
                error={!!errors.soilSensitivity}
                helperText={errors.soilSensitivity?.message}
                inputProps={{ 
                    min: 0, 
                    max: 5, 
                    step: "1",
                    pattern: "[0-9]*"
                }}
                onChange={(e) => {
                    const value = e.target.value;
                    if (value.includes('.')) {
                    field.onChange(value.split('.')[0]);
                    } else {
                    field.onChange(value);
                    }
                }}
                />
            )}
            />

        <MDButton 
          type="submit" 
          color="secondary" 
          variant="outlined" 
          sx={{ mt: 2 }}
        >
          Guardar Cambios
        </MDButton>
      </Box>
    </Modal>
  );
}