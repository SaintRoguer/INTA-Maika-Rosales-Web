import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Box, IconButton, Tooltip } from '@mui/material';
import Icon from "@mui/material/Icon";

import { MRT_Localization_ES } from 'material-react-table/locales/es/index.js';

import { updateSession } from "../../lib/db-client";

import { useMaterialUIController} from "context";


import { darken, lighten, useTheme } from '@mui/material';

import BasicModal from "../ModalAdmin/Modal";

import MDButton from "components/MDButton";




export default function CustomTable(props) {
  

  const [validationErrors, setValidationErrors] = useState({});
  const { tableHead, tableData } = props;

  const [columns, setColumns] = useState(tableHead);
  const [data, setData] = useState(tableData);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const theme = useTheme();
   //light or dark green
   const baseBackgroundColor =
   darkMode ? 
   theme.palette.mode === 'dark'
   ? 'rgba(31, 40, 62, 1)'
   : 'rgba(31, 40, 62, 1)':
   theme.palette.mode === 'dark'
     ? 'rgba(255, 255, 255, 1)'
     : 'rgba(255, 255, 255, 1)';

   // light or dark font color
   const fontColor = darkMode ? theme.palette.common.white : theme.palette.common.black;

   

   const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'common',
  });
  
  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        return value.trim() ? '' : 'El nombre es requerido';
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Email inválido';
      case 'password':
        return value.length >= 6
          ? ''
          : 'La contraseña debe tener al menos 6 caracteres';
      case 'role':
        return value in ['admin', 'common'] ? '' : 'El rol es requerido';
      default:
        return '';
    }
  };
  
  const handleInputChange = (field, value) => {
    const error = validateField(field, value);
    setValidationErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setUserData((prevData) => ({ ...prevData, [field]: value }));
  };


  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => {setIsModalOpen(false); setUserData({ name: '', email: '', password: '', role: 'common' })}; 

  const validateUserData = () => {
    const errors = {};
    if (!userData.name.trim()) errors.name = 'El nombre es requerido';
    if (!userData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email))
      errors.email = 'Email inválido';
    if (!userData.password.trim() || userData.password.length < 6)
      errors.password = 'La contraseña debe tener al menos 6 caracteres : ' + userData.password;
    if (!userData.role) errors.role = 'El rol es requerido';
    return errors;
  };

  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);
  const [error, setError] = useState('');
  const handleModalErrorOpen = () => setIsModalErrorOpen(true);
  const handleModalErrorClose = () => setIsModalErrorOpen(false);

  const handleCreateUser = async () => {
    handleInputChange('name', userData.name);
    handleInputChange('email', userData.email);
    handleInputChange('password', userData.password);
  
    const errors = validateUserData();
    if (Object.keys(errors).length > 0) {
      console.error('Validation Errors:', errors);
      return; // Stop submission if there are validation errors
    }
  
    try {
      const response = await fetch('/api/admin/createUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
  
      if (response.ok) {
        addUserToTable(userData);
        setUserData({ name: '', email: '', password: '', role: 'common' });
        handleModalClose();
      } else {
        const errorData = await response.json();
        setError(errorData.error);
        handleModalErrorOpen();
      }
    } catch (error) {
      setError(errorData.error);
      handleModalErrorOpen();
    }
  };
  
  const addUserToTable = (newUser) => {
    setData((prevData) => [...prevData, newUser]);
  };
   //UPDATE action
   const handleSaveRow = async ({ row, table,values }) => {
    const newValidationErrors = validateValue(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;//algun modal o tooltip, mejor tooltip
    }

    new Promise((resolve, reject) => {
      setTimeout(async () => {
        //Actualizo en firebase
        if (row.original.description !== values.description) {
          //Only session description is editable
          await updateSession(
            row.original.sessionId,
            row.original.id,
            values.description
          );
        }
        //La tabla se actualiza sola gracias a SWR
        resolve();
      }, 1000);
    }),
    table.setEditingRow(null); //exit editing mode
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
        overflowX: 'auto',      },
    },
    displayColumnDefOptions: {
      'mrt-row-actions': {
        header: 'Acciones',
        size: 50,
        muiTableHeadCellProps: {
            align: 'center', //change head cell props
          }, 
      },
    },
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveRow,
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Editar">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <Icon sx={{color: darkMode ? '#FFFFFF' : '#000000'}} fontSize="small">edit</Icon>
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar">
          <IconButton onClick={() => table.delete(row)}>
            <Icon sx={{color: darkMode ? '#FFFFFF' : '#000000'}} fontSize="small">person_remove</Icon>
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
    muiTopToolbarProps :  {
      sx: {
        '.MuiIconButton-root': {
          color: darkMode ? theme.palette.common.white : theme.palette.common.black,
        },
        '.MuiPaper-root': {
          padding: '0rem',
         }
      },
    },
    muiBottomToolbarProps :  {
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
    muiTablePaperProps : {
      sx: {
        '.MuiPaper-elevation	': {
          padding: '0rem',
         }
      },
    },
    renderTopToolbarCustomActions : () => (
      <MDButton 
        variant="gradient" 
        color="dark"
        onClick={() => handleModalOpen()}
      >
        <Icon sx={{ fontWeight: "bold" }}>person_add</Icon>
        &nbsp;Añadir nuevo usuario
      </MDButton>
    ),
  });
  
return(
<div style={{ overflowX: 'auto' }}>
  <MaterialReactTable table={table}/>
  <BasicModal
    open={isModalOpen}
    onClose={handleModalClose}
    onInputChange={handleInputChange}
    createUser={handleCreateUser}
    validationErrors={validationErrors}
    openError={isModalErrorOpen}
    onCloseError={handleModalErrorClose}
    error={error}
/>

</div>
)}

CustomTable.propTypes = {
  tableHead: PropTypes.arrayOf(PropTypes.object),
  tableData: PropTypes.arrayOf(PropTypes.object),
};


const validateRequired = (value) => !!value.length;

function validateValue(value) {
  return {
    description: !validateRequired(value.description)
      ? 'La descripción es requerida'
      : '',
  };
}