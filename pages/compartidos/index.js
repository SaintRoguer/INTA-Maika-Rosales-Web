import Admin from "layouts/Admin.js";
import Table from "components/TableShare/Table.js";
import React from "react";

import useSWR from "swr";
import moment from "moment";
import "moment/locale/es";
import { CSVLink } from "react-csv";
import Button from "components/CustomButtons/Button.js";
import formatCsvDataAllSessions from "../../lib/formatCsvDataAllSessions";
import generatePdf from "../../lib/pdfGeneratorAllSessions";

import MDBox from "components/MDBox";

import { Box, CircularProgress } from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TableContainer from "@mui/material/TableContainer";



function Shared({}) {
  const { data, error, isLoading } = useSWR("/api/compartidos/getAllSharedSessions", {
    refreshInterval: 20000, //Refresca cada 20 seg
  });

  if (error) return <div>Error al cargar los datos.</div>;
  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  const tableData = getTableData(data.sessions);

  return (
    <Table
      tableHead={[
        {
          accessorKey: "description",
          header: "Descripción",
        },
        {
          accessorKey: "date",
          header: "Fecha",
          enableEditing: false,
        },
        {
          accessorKey: "creator",
          header: "Creada por",
          enableEditing: false,
        },
        {
          accessorKey: "numberOfLotes",
          header: "Cantidad de lotes",
          enableEditing: false,
        },
      ]}
      tableData={tableData}
    />
  );
}

function getTableData(data) {
  let tableData = [];

  if (data) {
    data.map((session) => {
      tableData.push({
        id: session.sessionDetailId,
        permission: session.permission,
        sessionId: session.sessionId,
        description: session.description,
        date: moment(new Date(session.date._seconds * 1000)).format("L"),
        creator: session.user,
        numberOfLotes: session.lotes.length,
      });
    });
  }

  return tableData;
}

Shared.layout = Admin;

export default Shared;
