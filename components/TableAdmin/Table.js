import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Box, IconButton, Tooltip } from '@mui/material';
import Icon from "@mui/material/Icon";
import { useForm, Controller } from 'react-hook-form';


import { MRT_Localization_ES } from 'material-react-table/locales/es/index.js';

import { useMaterialUIController } from "context";
import { useModal } from "context/ModalContext"; 

import { darken, lighten, useTheme } from '@mui/material';

import MDButton from "components/MDButton";
import ModalManager from "components/ModalManager/ModalManager";

export default function CustomTable(props) {
  const { openModal, closeModal } = useModal(); 

  const [validationErrors, setValidationErrors] = useState({});
  const { tableHead, tableData, roles } = props;

  const [columns, setColumns] = useState(tableHead);
  const [data, setData] = useState(tableData);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const theme = useTheme();

  const baseBackgroundColor = darkMode ?
    theme.palette.mode === 'dark'
      ? 'rgba(31, 40, 62, 1)'
      : 'rgba(31, 40, 62, 1)' :
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 1)'
      : 'rgba(255, 255, 255, 1)';

  const fontColor = darkMode ? theme.palette.common.white : theme.palette.common.black;

  const validateUserData = (field, value, userData) => {
    const errors = {};
    switch (field) {
      case 'name':
        errors.name = value.trim() ? '' : 'El nombre es requerido';
        break;
      case 'email':
        errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Email inválido';
        break;
      case 'password':
        errors.password = value.length >= 6 ? '' : 'La contraseña debe tener al menos 6 caracteres';
        break;
      case 'role':
        errors.role = ['admin', 'common'].includes(value) ? '' : 'El rol es requerido';
        break;
      default:
        break;
    }

    if (!field) {
      if (!userData.name.trim()) errors.name = 'El nombre es requerido';
      if (!userData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email))
        errors.email = 'Email inválido';
      if (userData.password)
        if (!userData.password.trim() || userData.password.length < 6)
          errors.password = 'La contraseña debe tener al menos 6 caracteres';
      if (!['admin', 'common'].includes(userData.role))
        errors.role = 'El rol es requerido';
    }
  
    return errors;
  };

  const [error, setError] = useState('');

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'common',
    },
  });

  const handleCreateUser = async (formData) => {
    try {
      const response = await fetch('/api/admin/createUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        addUserToTable(formData);
        reset(); // Reset form fields
        closeModal();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      openModal('error', { error: error.message });
    }
  };
  const addUserToTable = (newUser) => {
    setData((prevData) => [...prevData, newUser]);
  };

  const handleSaveRow = async ({ row, table, values }) => {
    const errors = validateUserData(null, null, values);
    if (Object.keys(errors).some((key) => errors[key])) {
      setValidationErrors(errors);
      console.error('Validation Errors:', errors);
      return;
    }
  
    new Promise((resolve, reject) => {
      setTimeout(async () => {
       
        if (
          row.original.name !== values.name ||
          row.original.email !== values.email ||
          row.original.role !== values.role ||
          row.original.photoUrl !== values.photoUrl
        ) {
          try {
            const response = await fetch('/api/admin/updateUser', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                uid: row.original.uid,
                name: values.name,
                email: values.email,
                role: values.role,
                photoUrl: values.photoUrl,
              }),
            });
            if (!response.ok) {
              const errorData = await response.json();
              setError(errorData.error);
              openModal('error', { error: errorData.error });
            }
          } catch (error) {
            setError(error.message);
            openModal('error', { error: error.message });
          }
        }
        resolve();
      }, 1000);
    });
  
    table.setEditingRow(null); 
  };

  const handleDeleteUser = (row) => {
    openModal('deleteUser', {
      onConfirm: async () => {
        try {
          const response = await fetch('/api/admin/deleteUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid: row.original.uid }),
          });

          if (response.ok) {
            window.alert('Usuario eliminado correctamente');
            setData((prevData) => prevData.filter((user) => user.uid !== row.original.uid));
          } else {
            const errorData = await response.json();
            throw new Error(errorData.error);
          }
        } catch (error) {
          throw error; 
        }
      },
    });
  };

  const handleChangePassword = (row) => {
    openModal('changePassword', {
      onSubmit: async (newPassword) => {
        try {
          const response = await fetch('/api/admin/updateUser', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ uid: row.original.uid, password: newPassword }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al actualizar usuario');  
          }

          window.alert('Contraseña cambiada correctamente');
        } catch (error) {
          throw error; 
        }
      },
    });
  };

  const handleOpenCreateUserModal = () => {
    openModal('createUser', {
      control,
      onSubmit: handleSubmit(handleCreateUser),
      onClose: () => {
        reset();
        closeModal();
      },
      roles,
    });
  };

  const table = useMaterialReactTable({
    columns,
    data,
    localization: MRT_Localization_ES,
    enableEditing: true,
    editDisplayMode: 'row',
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: data
      ? {
        color: 'error',
        children: 'Error loading data',
      }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
        overflowX: 'auto',
      },
    },
    displayColumnDefOptions: {
      'mrt-row-actions': {
        header: 'Acciones',
        size: 50,
        muiTableHeadCellProps: {
          align: 'center',
        },
      },
    },
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveRow,
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Editar">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <Icon sx={{ color: darkMode ? '#FFFFFF' : '#000000' }} fontSize="small">edit</Icon>
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar">
          <IconButton onClick={() => handleDeleteUser(row)}>
            <Icon sx={{ color: darkMode ? '#FFFFFF' : '#000000' }} fontSize="small">delete</Icon>
          </IconButton>
        </Tooltip>
        <Tooltip title="Cambiar contraseña">
          <IconButton onClick={() => handleChangePassword(row)}>
            <Icon sx={{ color: darkMode ? '#FFFFFF' : '#000000' }} fontSize="small">key</Icon>
          </IconButton>
        </Tooltip>
      </Box>
    ),
    muiTableHeadProps: {
      sx: {
        padding: '0rem',
        display: 'table-header-group',
        color: fontColor,
      },
    },
    muiTableProps: {
      sx: {
        padding: '0rem',
      },
    },
    muiTableBodyProps: {
      sx: (theme) => ({
        '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]) > td':
        {
          backgroundColor: darkMode ? baseBackgroundColor : '#F5F5F5',
          color: fontColor,
        },
        '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]):hover > td':
        {
          backgroundColor: darkMode ? baseBackgroundColor : '#F5F5F5',
        },
        '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]) > td':
        {
          backgroundColor: darkMode ? baseBackgroundColor : '#F5F5F5',
          color: fontColor,
        },
        '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]):hover > td':
        {
          backgroundColor: darkMode ? baseBackgroundColor : '#F5F5F5',
        },
      }),
    },
    muiTableContainerProps: {
      sx: {
        backgroundColor: darkMode ? baseBackgroundColor : '#F5F5F5',
      },
    },
    muiTablePaperProps: {
      sx: {
        '& .MuiPopover-paper': {
          padding: 0,
        },
        '& .MuiMenu-paper': {
          padding: 0,
        },
      },
    },
    mrtTheme: (theme) => ({
      baseBackgroundColor: darkMode ? baseBackgroundColor : darken(baseBackgroundColor, 0.1),
      draggingBorderColor: theme.palette.secondary.main,
    }),
    muiTableHeadCellProps: {
      sx: {
        fontWeight: 'bold',
        color: fontColor,
        '.MuiIconButton-root': {
          color: darkMode ? theme.palette.common.white : theme.palette.common.black,
        },
      },
    },
    muiTopToolbarProps: {
      sx: {
        '.MuiIconButton-root': {
          color: darkMode ? theme.palette.common.white : theme.palette.common.black,
        },
        '.MuiPaper-root': {
          padding: '0rem',
        }
      },
    },
    muiBottomToolbarProps: {
      sx: {
        '.MuiIconButton-root': {
          color: darkMode ? theme.palette.common.white : theme.palette.common.black,
        },
        '.MuiTypography-root': {
          color: darkMode ? theme.palette.common.white : theme.palette.common.black,
        },
        '.MuiSelect-select': {
          color: darkMode ? theme.palette.common.white : theme.palette.common.black,
        },
      },
    },
    muiTablePaperProps: {
      sx: {
        '.MuiPaper-elevation': {
          padding: '0rem',
        }
      },
    },
    renderTopToolbarCustomActions: () => (
      <MDButton
        variant="gradient"
        color="dark"
        onClick={handleOpenCreateUserModal}
      >
        <Icon sx={{ fontWeight: "bold" }}>person_add</Icon>
        &nbsp;Añadir nuevo usuario
      </MDButton>
    ),
  });

  return (
    <div style={{ overflowX: 'auto' }}>
      <MaterialReactTable table={table} />
      <ModalManager /> 
    </div>
  );
}

CustomTable.propTypes = {
  tableHead: PropTypes.arrayOf(PropTypes.object),
  tableData: PropTypes.arrayOf(PropTypes.object),
};