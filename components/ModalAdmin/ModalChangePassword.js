import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { Modal, TextField, InputAdornment } from '@mui/material';
import MDButton from 'components/MDButton';
import { useMaterialUIController } from 'context';
import MDTypography from 'components/MDTypography';
import ModalError from './ModalError'; 

export default function ModalChangePassword({ open, onClose, onSubmit }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(''); 
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false); 

  const handleSubmit = async () => {
    if (!newPassword) {
      setError('La contraseña no puede estar vacía');
      setIsModalErrorOpen(true); 
      return;
    }

    try {
      await onSubmit(newPassword); 
      onClose(); 
    } catch (error) {
      setError(error.message); 
      setIsModalErrorOpen(true); 
    }
  };

  const handleCloseError = () => {
    setIsModalErrorOpen(false); 
    setError(''); 
  };

  const handleCloseModal = () => {
    setNewPassword(''); 
    onClose(); 
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
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
          }}
        >
          <Box
            component="form"
            sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                id="password"
                label="Nueva contraseña"
                type="password"
                variant="standard"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={!!error}
                helperText={error}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {/* You can add an icon here if needed */}
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <MDButton onClick={handleCloseModal} color="secondary" variant="outlined" sx={{ mr: 2 }}>
              <MDTypography variant="button">Cancelar</MDTypography>
            </MDButton>
            <MDButton onClick={handleSubmit} color="primary" variant="contained">
              <MDTypography variant="button">Confirmar</MDTypography>
            </MDButton>
          </Box>
        </Box>
      </Modal>

      {/* Error Modal */}
      <ModalError
        open={isModalErrorOpen}
        onClose={handleCloseError}
        error={error}
      />
    </>
  );
}