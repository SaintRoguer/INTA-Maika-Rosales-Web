import React, { useState } from "react";
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
import { useModal } from "context/ModalContext"; 
import ModalManager from "components/ModalManager/ModalManager";
import { darken, lighten, useTheme } from '@mui/material';
import { color, padding } from "@mui/system";

export default function CustomTable(props) {
  const { openModal, closeModal } = useModal(); 
  const [validationErrors, setValidationErrors] = useState({});
  const { tableHead, tableData } = props;
  const [isEditing, setIsEditing] = useState(false); // Track editing state
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

  const goToSessionDetail = (rowData) => {
    /*router.push("/sesion/[id]", `/sesion/${rowData.id}`, {
      shallow: true,
    });*/
    window.location.replace(`/sesiones/${rowData}`);
  };
   //UPDATE action
   const handleSaveRow = async ({ row, table,values }) => {
    const newValidationErrors = validateValue(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;//algun modal o tooltip, mejor tooltip
    }
    setIsEditing(true); // Disable row clicks while saving

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
    setIsEditing(false); // Re-enable row clicks after saving

    table.setEditingRow(null); //exit editing mode
  };

  const handleChangeSharedPermission = (row) => {
    const sessionId = row.original.id;
    openModal('share', {
      onClose: () => {
        closeModal();
      },
      sessionId,
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
        overflowX: 'auto',      },
    },
    displayColumnDefOptions: {
      'mrt-row-actions': {
        header: 'Editar',
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
      }
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: !isEditing
        ? (event) => {
            const columnIndex = event.target.cellIndex;
            if (columnIndex !== undefined) goToSessionDetail(row.id);
          }
        : undefined, // Disable click when editing
      sx: {
        cursor: isEditing ? 'not-allowed' : 'pointer', // Change cursor style
      },
    }),
    onEditingRowCancel: () => (setValidationErrors({}),setIsEditing(false)),
    onEditingRowSave: handleSaveRow,
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem', justifyContent: "center" ,width:"100%" }}>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Tooltip title="Editar">
            <IconButton
              onClick={() => {
                setIsEditing(true);
                table.setEditingRow(row);
              }}
            >
              <Icon
                sx={{ color: darkMode ? '#FFFFFF' : '#000000' }}
                fontSize="small"
              >
                edit
              </Icon>
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Tooltip title="Cambiar permisos">
            <IconButton onClick={() => handleChangeSharedPermission(row)}>
              <Icon
                sx={{ color: darkMode ? '#FFFFFF' : '#000000' }}
                fontSize="small"
              >
                group
              </Icon>
            </IconButton>
          </Tooltip>
        </Box>

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
  });
  
return(
<div style={{ overflowX: 'auto' }}>
  <MaterialReactTable table={table}/>
  <ModalManager /> {/* Render the ModalManager */}
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