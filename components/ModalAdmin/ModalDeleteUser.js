import React, { useState } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { useMaterialUIController } from 'context';
import MDButton from 'components/MDButton';
import MDTypography from 'components/MDTypography';
import ModalError from './ModalError';

export default function ModalDeleteUser({ open, onClose, onConfirm }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const [error, setError] = useState('');
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false); 

  const handleConfirm = async () => {
    try {
      await onConfirm(); 
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

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            ¿Estás seguro de que deseas eliminar este usuario?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <MDButton onClick={onClose} color="secondary" variant="outlined" sx={{ mr: 2 }}>
              <MDTypography variant="button">Cancelar</MDTypography>
            </MDButton>
            <MDButton onClick={handleConfirm} color="error" variant="contained">
              <MDTypography variant="button">Eliminar</MDTypography>
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