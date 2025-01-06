import Admin from "layouts/Admin.js";
import Table from "components/Table/Table.js";
import React from "react";

import useSWR from "swr";
import moment from "moment";
import "moment/locale/es";
import { CSVLink } from "react-csv";
import Button from "components/CustomButtons/Button.js";
import formatCsvDataAllSessions from "../../lib/formatCsvDataAllSessions";
import generatePdf from "../../lib/pdfGeneratorAllSessions";

import MDBox from "components/MDBox";

import { CircularProgress } from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TableContainer from "@mui/material/TableContainer";
import { getAllSessions } from "../../lib/db-admin";

export async function getServerSideProps() {
  try {
    const sessions = await getAllSessions();
    return {
      props: {
        sessions,
      },
    };
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return {
      props: {
        sessions: [],
      },
    };
  }
}

function Sesiones({ sessions }) {
  let csvData;
  let tableData = getTableData(sessions);

  React.useEffect(() => {
    console.log(sessions);
  }, [sessions]);

  /*const { data: allInfo, error: allInfoError } = useSWR(`/api/all`, {
    refreshInterval: 1000,
  });

  if (allInfo) {
    csvData = { ...formatCsvDataAllSessions(allInfo) };

  const { data, error } = useSWR(`/api/sessions`, {
    refreshInterval: 1000,
  });

  if (error) return <h3>Error al cargar...</h3>;
  if (!data) {
    return <h3><CircularProgress /></h3>; //todo: Poner spinner?
  }*/

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

Sesiones.layout = Admin;

export default Sesiones;
