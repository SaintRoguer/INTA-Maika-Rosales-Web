import React, { useState } from "react";
import makeStyles from '@mui/styles/makeStyles';
import styles from "assets/jss/nextjs-material-dashboard/components/tableStyle.js";
import { optionsConfig, localizationConfig } from "../config/tableConfig";
import { editItemFromArrayByDescription } from "../../../lib/db-client";

import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import Icon from "@mui/material/Icon";
import { MRT_Localization_ES } from 'material-react-table/locales/es/index.js';
import { useMaterialUIController} from "context";
import { darken, lighten, useTheme } from '@mui/material';

const useStyles = makeStyles(styles);

export default function SessionNotesTable(props) {
  const [validationErrors, setValidationErrors] = useState({});
  const classes = useStyles();
  const { tableHead, tableData, sessionDetailsId, onUpdateData,sessionDetailIDoc } = props;
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
        if (row.original.note !== values.note) {
          await editItemFromArrayByDescription(
            "notes",
            "sessionsDetails",
            sessionDetailIDoc,
            row.original.note,
            values.note
          );
        }

        //Actualizo la tabla (en este caso lo hago manual porque el SWR no interviene)
        const dataUpdate = [...data];
        const index = row.id;
        dataUpdate[index].note = values.note;
        setData([...dataUpdate]);
        onUpdateData(data);

        //TODO: Do something like this to update note at real time?
        // props.onUpdate(dataUpdate);
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
    },
  },
  displayColumnDefOptions: {
    'mrt-row-actions': {
      header: 'Editar'
    }
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
          backgroundColor: lighten(baseBackgroundColor, 0.1),
          color: fontColor,


        },
      '& tr:nth-of-type(odd):not([data-selected="true"]):not([data-pinned="true"]):hover > td':
        {
          backgroundColor: darken(baseBackgroundColor, 0.2),
        },
      '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]) > td':
        {
          backgroundColor: darkMode ? baseBackgroundColor : darken(baseBackgroundColor, 0.1),
          color: fontColor,


        },
      '& tr:nth-of-type(even):not([data-selected="true"]):not([data-pinned="true"]):hover > td':
        {
          backgroundColor: darken(baseBackgroundColor, 0.2),
        },
    }),
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

  return (
    <div className={classes.tableResponsive}>
      <MaterialReactTable table={table}/>
    </div>)

}

const validateRequired = (value) => !!value.length;

function validateValue(value) {
  return {
    description: !validateRequired(value.note)
      ? 'La nota es requerida'
      : '',
  };
}
