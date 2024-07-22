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
import EditIcon from '@mui/icons-material/Edit';
import { MRT_Localization_ES } from 'material-react-table/locales/es/index.js';

const useStyles = makeStyles(styles);

export default function SessionNotesTable(props) {
  const [validationErrors, setValidationErrors] = useState({});
  const classes = useStyles();
  const { tableHead, tableData, sessionDetailsId, onUpdateData,sessionDetailIDoc } = props;
  const [columns, setColumns] = useState(tableHead);
  const [data, setData] = useState(tableData);

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
          <EditIcon />
        </IconButton>
      </Tooltip>
    </Box>
  ),
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
