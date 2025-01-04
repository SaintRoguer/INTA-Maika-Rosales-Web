import React, { useState } from "react";
import Admin from "layouts/Admin.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "@mui/material/Card";

import { useRouter } from "next/router";
import useSWR from "swr";
import LoteInfo from "components/LoteInfo/LoteInfo";
import SessionNoteModal from "../../components/Modal/SessionNoteModal/SessionNoteModal";
import moment, { min } from "moment";
import "moment/locale/es";
import { getAllSessions, getSessionDetails } from "../../lib/db-admin";
import generatePdf from "../../lib/pdfGeneratorSingleSession";
import formatCsvDataSingleSession from "../../lib/formatCsvDataSingleSession";
import { CSVLink } from "react-csv";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Icon from "@mui/material/Icon";
import Divider from '@mui/material/Divider';


import {
  useMaterialUIController,
} from "context";


// This function gets called at build time
export async function getStaticPaths() {
  const sessions = await getAllSessions();

  //Get the paths we want to pre-render based on sessionsIds
  const paths = sessions.map((session) => ({
    params: { sessionId: session.sessionDetailId },
  }));

  // We'll pre-render only these paths at build time.
  //{ fallback: false } means other routes should 404.
  // fallback: true will generate that path for next time
  return { paths, fallback: true };
}

export async function getStaticProps(context) {
  const { params } = context;
  const { sessionId } = params;

  let sessionDetails = await getSessionDetails(sessionId);
  sessionDetails = JSON.stringify(sessionDetails);

  return {
    props: { sessionDetails, sessionId }, // will be passed to the page component as props
    revalidate: 1, // In seconds
  };
}

function SessionDetail({ sessionDetails, sessionId }) {
  const [showNotes, setShowNotes] = useState(false);
  const router = useRouter();

  if (router.isFallback) return <h3> Cargando... </h3>;

  //TODO: Poner esto en un use Effect?
  let sessionDetailsJSON = JSON.parse(sessionDetails);
  const [notesData, setNotesData] = useState(sessionDetailsJSON.notes);
  //Only make request if sessionDetailsJson lotes length > 0 ?
  const { data: dataLotes, error: errorLotes } = useSWR(
    "/api/lotesDetails/" + router.query.sessionId,
    !showNotes ? { refreshInterval: 1000 } : { refreshInterval: 200000 }
  );

  if (!dataLotes) {
    return <h3>Cargando...</h3>;
  }

  if (errorLotes) {
    return <h3>Error al obtener la información de los lotes</h3>;
  }

  function goToDashboard(e) {
    router.push("/admin/sesiones");
  }

  const lotesInfo = () => {
    dataLotes.sort(
      (a, b) =>
        new Date(b.loteData.creationDate._seconds * 1000).getTime() -
        new Date(a.loteData.creationDate._seconds * 1000).getTime()
    );

    if (dataLotes && dataLotes.length > 0) {
      return (
        <>
          {dataLotes.map((lote) => (
            <LoteInfo key={lote.loteDetailId} {...lote} />
          ))}
        </>
      );
    } else {
      //La sesión no tiene lotes
      return (
        <GridItem xs={12} sm={12} md={12}>
          <MDTypography variant="h4" color= {darkMode? "white" : "dark" } >  
              Esta sesión todavía <strong>no tiene ningún lote</strong> cargado.
            ¡Comenza a crearlos desde la aplicación móvil!
            </MDTypography>
          </GridItem>
      );
    }
  };

  const handleOnUpdate = (data) => {
    const dataArray = Object.values(data);
    for (let i = 0; i < data.length; i++) {
      dataArray[i] = data[i].note;
    }
    setNotesData(dataArray);
  };

  const [controller, dispatch] = useMaterialUIController();
  const {
    darkMode,
  } = controller;

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12} style={{ marginBottom: 20 }}>
    
          <Card style={{backgroundColor: darkMode ? "#1f283e" :'#42424a'}}>
                <MDBox sx={{ display: "flex", pr:"0.5rem", pt:"0.5rem", pl:"0.5rem", flexDirection: 'row', flexGrow: 1,}}> 
                  <MDBox 
                    sx={{ whiteSpace: 'nowrap',flexGrow: 1, }}
                  >   
                  <MDTypography variant="h4" color="white" alignItems="center" lineHeight={1} fontSize="20px"  sx={{ fontWeight: 'light', padding:"0.5rem" }}>
                    <Icon fontSize="small" color="light">
                        event
                        </Icon> Sesión creada el{" "}
                    
                        {moment(
                          new Date(sessionDetailsJSON.date._seconds * 1000)
                        ).format("L")}
                      {" "}
                      a las{" "}
                      {moment(
                        new Date(sessionDetailsJSON.date._seconds * 1000),
                        "dd/mm/yyyy"
                      ).format("HH:mm")}{" "}
                      hs
                      </MDTypography>
                      </MDBox>
                  {dataLotes && dataLotes.length > 0 ? (
                    <MDBox alignItems="center"
                      spacing={1}
                      justifyContent="space-around"
                      sx={{ display: "flex",flexDirection: 'row', pr:"0.5rem", pt:"0.5rem", minWidth:"400px"}}
                    >
                    
                    <CSVLink {...formatCsvDataSingleSession(dataLotes)} sx={{marginRight:"auto"}} >

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
                          <MDTypography color="success"  sx={{ fontSize: 16}} >
                            Descargar CSV
                          </MDTypography>
              
                       </MDButton>
                    </CSVLink>

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
                        <MDTypography color="error" direction="row"  sx={{ fontSize: 16, whiteSpace: 'nowrap',minWidth:"max-content" }}>
                          Descargar PDF
                        </MDTypography>

                      </MDButton>
                    </MDBox>
                  ) : (
                    ""
                  )}
                  </MDBox>
                  <MDBox spacing={{ xs: 1, sm: 2 }}
                    direction="row" 
                    pl="0.5rem"
                    pb="0.5rem"
                    >
                  <MDTypography variant="h6" color="white" alignItems="center" lineHeight={1}  padding="0.5rem" verticalAlign="text-top">
                    <Icon fontSize="small" color="light">
                          person
                          </Icon> Creada por{" "}
                      <strong>{sessionDetailsJSON.user}</strong>
                  </MDTypography>
              </MDBox>
          </Card>
          <Divider orientation="horizontal" variant="middle" flexItem   sx={{
            opacity: 
              darkMode
                ? 0.6
                : 1,
          }}/>


          {/* Session Description and Notes */}
          <MDBox sx={{ display: "flex", flexDirection: 'column', flexGrow: 1,}}> 
            <MDBox >
          
              <MDTypography color= {darkMode? "white" : "dark" } >  
                <Icon style={{ marginBottom: -2 }} >description</Icon>
                <strong> Descripción: </strong>
                  {sessionDetailsJSON.description}
              </MDTypography>
            </MDBox>

            <MDTypography color= {darkMode? "white" : "dark" } >  
            <div className="row" onClick={() => setShowNotes(true)}>
              <Icon style={{ marginBottom: -2 }} >speaker_notes</Icon>{" "}
                Ver{" "}
                <MDButton
                        onClick={() => setShowNotes(true)}
                        target="_blank"
                        rel="noreferrer"
                        color={darkMode? "white" : "dark" }
                        variant="text"
                        size="large"
                        sx={{ whiteSpace: 'nowrap',minWidth:"max-content", padding:"0"}}

                      >
                <strong style={{ textDecoration: "underline" }}>
                   ({sessionDetailsJSON.notes ? sessionDetailsJSON.notes.length : 0}) Notas
                </strong>
                </MDButton>
                {" "}de la sesión
            </div>
            </MDTypography>

          </MDBox>
        </GridItem>

        {showNotes ? (
          <SessionNoteModal
            onCloseModal={async () => {
              setShowNotes(false);
            }}
            title="Notas de la sesión"
            notes={notesData}
            sessionDetailsId={sessionDetailsJSON.id}
            onUpdate={handleOnUpdate}
            sessionDetailIDDoc={sessionId}
          />
        ) : (
          ""
        )}

        {lotesInfo()}
      </GridContainer>
    </div>
  );
}

SessionDetail.layout = Admin;

export default SessionDetail;
