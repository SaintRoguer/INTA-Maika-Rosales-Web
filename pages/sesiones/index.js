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

import { Box, CircularProgress } from "@mui/material";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { useMaterialUIController } from "context";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import MDButton from "components/MDButton";


/*export async function getServerSideProps() {
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
}*/

function Sesiones({}) {
  
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  let csvData;
  const { data, error, isLoading } = useSWR("/api/sessions/getAllSessions", {
    refreshInterval: 20000, 
  });

  const { allInfo, allInfoerror } = useSWR("/api/all", {
    refreshInterval: 20000, 
  }); 

  if (allInfo) {
    csvData = { ...formatCsvDataAllSessions(allInfo) };
  }

  if (error) return <div>Error al cargar los datos.</div>;
  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  const tableData = getTableData(data.sessions);

  return (
     <GridContainer>
        <GridItem xs={12} sm={12} md={12} style={{ marginBottom: 20 }}>
          <Card sx={{}} style={{backgroundColor: darkMode ? "#1f283e" :'#42424a'}}>
                    <MDBox sx={{ display: "flex", pr:"0.5rem", pt:"0.5rem", pl:"0.5rem", flexDirection: 'row', flexGrow: 1,}}> 
                      <MDBox 
                        sx={{ whiteSpace: 'nowrap',flexGrow: 1, }}
                      >   
                      <MDTypography component="div" variant="h4" color="white" alignItems="center" lineHeight={1} fontSize="20px"  sx={{ fontWeight: 'light', padding:"0.5rem" }}>
                        Lista de sesiones creadas en la aplicación móvil{" "}
                          </MDTypography>
                          </MDBox>

                      
                 
                    <MDBox 
                      alignItems="center"
                      spacing={1}
                      justifyContent="space-around"
                      sx={{ display: "flex",flexDirection: 'row', pr:"0.5rem", pt:"0.5rem", minWidth:"400px"}}
                    >
                      <MDButton       
                        target="_blank"
                        rel="noreferrer"
                        color="success"
                        variant="outlined"
                        size="small"
                        sx={{ whiteSpace: 'nowrap', minWidth:"max-content", }}
                      >
                      <Icon fontSize="small" color="success" >
                        article
                      </Icon>
                      <MDTypography component="div" color="success"  sx={{ fontSize: 16}} >
                        Descargar CSV
                      </MDTypography>
                                    
                      </MDButton>
                    <MDButton
                        onClick={() => generatePdf(dataLotes)}
                        target="_blank"
                        rel="noreferrer"
                        color="error"
                        variant="outlined"
                        size="small"
                        sx={{ whiteSpace: 'nowrap',minWidth:"max-content"}}

                      >
                        <Icon fontSize="small" color="light">
                        picture_as_pdf_two_tone
                        </Icon>
                        <MDTypography component="div" color="error" direction="row"  sx={{ fontSize: 16, whiteSpace: 'nowrap',minWidth:"max-content" }}>
                          Descargar PDF
                        </MDTypography>

                      </MDButton>

                    
                    </MDBox>
                    </MDBox>
                         <MDBox spacing={{ xs: 1, sm: 2 }}
                        direction="row" 
                        pl="0.5rem"
                        pb="0.5rem"
                        >
                      <MDTypography  component="div" variant="h6" color="white" alignItems="center" lineHeight={1}  padding="0.5rem" verticalAlign="text-top">
                        Hay 3 sesiones creadas{" "}
                      </MDTypography>
                  </MDBox>
          </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={12} style={{ marginBottom: 20 }}>

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
                    </GridItem>

     </GridContainer>
);}

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
