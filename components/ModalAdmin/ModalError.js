import React from 'react';
import Box from '@mui/material/Box';
import { Modal } from '@mui/material';
import MDButton from 'components/MDButton';
import { useMaterialUIController} from "context";
import MDTypography from 'components/MDTypography';

export default function ModalError({ open, onClose, error }) {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
        <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: !darkMode ? 'background.paper': 'rgba(31, 40, 62, 1)',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
        }}>
        <MDTypography variant="button" color="error">
            {error}
        </MDTypography>
        <MDButton onClick={onClose} color="secondary" variant="outlined" sx={{mt: 2}}>
            <MDTypography variant="button">
                Cerrar
            </MDTypography>
        </MDButton>
      </Box>
    </Modal>
  );
}