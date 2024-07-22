import React, { useState } from "react";
import PropTypes from "prop-types";
import makeStyles from '@mui/styles/makeStyles';
import styles from "assets/jss/nextjs-material-dashboard/components/tableStyle.js";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { MRT_Localization_ES } from 'material-react-table/locales/es/index.js';

import { updateSession } from "../../lib/db-client";

const useStyles = makeStyles(styles);

export default function CustomTable(props) {
  const [validationErrors, setValidationErrors] = useState({});
  const classes = useStyles();
  const { tableHead, tableData } = props;

  const [columns, setColumns] = useState(tableHead);
  const [data, setData] = useState(tableData);

  const goToSessionDetail = (rowData) => {
    /*router.push("/sesion/[id]", `/sesion/${rowData.id}`, {
      shallow: true,
    });*/
    window.location.replace(`/sesion/${rowData}`);
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
      },
    },
    displayColumnDefOptions: {
      'mrt-row-actions': {
        header: 'Editar'
      }
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: (event) => {
        const columnIndex = event.target.cellIndex;
        if (columnIndex !== undefined)// avoid clicking in action column
          goToSessionDetail(row.id);
      },
      sx: {
        cursor: 'pointer', //you might want to change the cursor too when adding an onClick
      },
      
    }),
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
    )
  });
  
return (
  <div className={classes.tableResponsive}>
    <MaterialReactTable table={table}/>
  </div>)
}

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