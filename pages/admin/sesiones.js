import Admin from "layouts/Admin.js";
import Table from "components/Table/Table.js";

import useSWR from "swr";
import moment from "moment";
import "moment/locale/es";
import { CSVLink } from "react-csv";
import Button from "components/CustomButtons/Button.js";
import formatCsvDataAllSessions from "../../lib/formatCsvDataAllSessions";
import generatePdf from "../../lib/pdfGeneratorAllSessions";

import MDBox from "components/MDBox";

import { CircularProgress } from '@mui/material';
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import TableContainer from "@mui/material/TableContainer";


const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};


function Sesiones() {

  let csvData;

  const { data: allInfo, error: allInfoError } = useSWR(`/api/all`, {
    refreshInterval: 1000,
  });

  if (allInfo) {
    csvData = { ...formatCsvDataAllSessions(allInfo) };
  }

  const { data, error } = useSWR(`/api/sessions`, {
    refreshInterval: 1000,
  });

  if (error) return <h3>Error al cargar...</h3>;
  if (!data) {
    return <h3><CircularProgress /></h3>; //todo: Poner spinner?
  }

  let tableData = getTableData(data);

  return (
    <>
           <TableContainer sx={{ boxShadow: "none" }}>

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
           
           </TableContainer>

    </>

  );
}

function getTableData(data) {
  let tableData = [];
  let sessionsArray = Object.values(data);

  if (data && sessionsArray) {
    sessionsArray.map((session) => {
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
