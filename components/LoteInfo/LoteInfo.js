import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import GridItem from "components/Grid/GridItem.js";
import Card from "@mui/material/Card";
import CardBody from "@mui/material/Card";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import LoteImages from "../LoteImages/LoteImages";
import SideImageInfo from "./SideImageInfo";
import LotePasturas from "../LotePasturas/LotePasturas";
import ImageIcon from "@mui/icons-material/Image";
import ArtTrackIcon from "@mui/icons-material/ArtTrack";
import AssessmentIcon from "@mui/icons-material/Assessment";
import moment, { min } from "moment";
import "moment/locale/es";
import { updateLote } from "../../lib/db-client";
import InfoAverage from "./InfoAverage";
import EditIcon from "@mui/icons-material/Edit";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import EditionModal from "../Modal/EditionModal";
import Alarms from "./Alarms/Alarms";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import {
  useMaterialUIController,
} from "context";
import { Tooltip } from "@mui/material";


const PREFIX = 'LoteInfo';

const classes = {
  cardCategoryWhite: `${PREFIX}-cardCategoryWhite`,
  cardTitleWhite: `${PREFIX}-cardTitleWhite`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')({
  [`& .${classes.cardCategoryWhite}`]: {
    color: "rgb(239,219,46)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  [`& .${classes.cardTitleWhite}`]: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
});

export default function LoteInfo(props) {
  const { loteData, pasturasData, loteDetailId, permission } = props;
  const [showSideImageInfo, setShowSideImageInfo] = useState(false);
  const [imageData, setImageData] = useState("");
  const [imageNumber, setImageNumber] = useState("");
  const [showHelp, setShowHelp] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [controller, dispatch] = useMaterialUIController();
  const {
    darkMode,
  } = controller;



  async function handleEditLote(newLoteDescription) {
    setShowEditModal(false);
    await updateLote(loteDetailId, newLoteDescription);
    //TODO: Spinner?
  }

  function showSideInfo(imageNumber, imageData) {
    setImageData(imageData);
    setImageNumber(imageNumber);
    setShowSideImageInfo(true);
    setShowHelp(false);
  }

  const showLoteImageInfo = (imageNumber, imageData) => {
    showSideInfo(imageNumber, imageData);
  };

  const showPasturaImageInfo = (imageNumber, imageData) => {
    //The code is the same that for a lote but I need to know the difference of the method's name for other components (smell code maybe)
    showSideInfo(imageNumber, imageData);
  };

  const editDescription = () => {
    return (
      permission === "Editor" || permission === undefined ? (
        <EditIcon
                onClick={() => {
                  setShowEditModal(true);
                }}
              />
      ) : (
        <Tooltip title="No tienes permiso para editar la descripción del lote">
          <EditIcon
            disabled
            color="black"        
          />
        </Tooltip>
      )
    )}

  const cardHeader = () => {
    return (
      <MDBox
                mx={2}
                mt={isMinimized ? "" :-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="dark"
                borderRadius="lg"
                coloredShadow="dark"
                sx={{flexGrow: 1,direction:"row",minWidth:isMinimized ? "300px" : "" }}
              >
        <div style={{ display: "flex"}}>
          <MDTypography color= "white"  fontSize="15px" fontWeight="bold" direction="row"   sx={{flexGrow: 1,direction:"row",}}>  

              {loteData.description} - Creado a las{" "}
              {moment(
                new Date(loteData.creationDate._seconds * 1000),
                "dd/mm/yyyy"
              ).format("HH:mm")}{" "}
              hs
                                  
          </MDTypography>
          <MDTypography color= "white"  fontSize="15px" fontWeight="bold" justifySelf="flex-end"
          >  
             {isMinimized ? (
            <div style={{ display: "flex" }}>
              {editDescription()}
              <ArrowDownwardIcon onClick={() => setIsMinimized(false)} />
            </div>
          ) : (
            <div style={{ display: "flex" }}>
              {editDescription()}
              <ArrowUpwardIcon
                onClick={() => {
                  setIsMinimized(true);
                }}
              />
            </div>
          )}
          </MDTypography>


        </div>
      </MDBox>
    );
  };

  const loteEditionModal = () => {
    if (showEditModal) {
      return (
        <EditionModal
          title={"Editar lote"}
          onCloseModal={async () => {
            setShowEditModal(false);
          }}
          handleEditLote={handleEditLote}
        />
      );
    }
  };

  const showContent = () => {
    if (isMinimized) {
      return (
        (<>
          <GridItem xs={12} sm={12} md={6} sx={{mb:"10px"}}>
            {cardHeader()}
          </GridItem>
          <GridItem xs={12} sm={12} md={6}></GridItem>
          {loteEditionModal()}
        </>)
      );
    } else {
      return (
        <>
          <GridItem xs={12} sm={12} md={6}>
            <Card sx={{mt:"30px", mb:"30px"}} >
              {cardHeader()}
              <GridItem xs={12} sm={12} md={12}>
                <MDTypography color={ darkMode ? "white" :"dark"}  fontSize="12px" fontWeight="bold" justifySelf="flex-end">
              
                    <strong>{loteData.images.length} imágenes</strong> y{" "}
                    <strong>{loteData.pasturas.length} pasturas</strong> asociadas
                </MDTypography>
              </GridItem>

              <Card sx={{pl:"20px", pr:"20px", pt:"20px", pb:"20px"}}>
                <CustomTabs
                  title="Ver:"
                  headerColor="dark"
                  tabs={[
                    {
                      tabName: "Imágenes",
                      tabIcon: ImageIcon,
                      tabContent: (
                        <LoteImages
                          images={loteData.images}
                          onImageSelected={showLoteImageInfo}
                          showNoImagesAlertIfEmpty={true}
                        />
                      ),
                    },
                    {
                      tabName: "Pasturas",
                      tabIcon: ArtTrackIcon,
                      tabContent: (
                        <LotePasturas
                          pasturasData={pasturasData}
                          onPasturaImageSelected={showPasturaImageInfo}
                        />
                      ),
                    },
                    {
                      tabName: "Promedios del lote",
                      tabIcon: AssessmentIcon,
                      tabContent: (
                        <InfoAverage
                          title={"Promedio de cobertura del lote"}
                          averageAfter={loteData.averageAfter}
                          averageBefore={loteData.averageBefore}
                          totalImagesAfter={loteData.totalImagesAfter}
                          totalImagesBefore={loteData.totalImagesBefore}
                        />
                      ),
                    },
                  ]}
                />
              </Card>
              <Card sx={{pl:"20px", pr:"20px", pt:"20px", pb:"20px"}}>
                <MDTypography color={ darkMode ? "white" :"dark"}  fontSize="12px" fontWeight="bold" justifySelf="flex-end">
                  <strong>Alarmas</strong>
                </MDTypography>
                <Alarms
                  windVelocity={loteData.windVelocity}
                  soilSensitivity={loteData.soilSensitivity}
                  averageAfter={loteData.averageAfter}
                  averageBefore={loteData.averageBefore}
                  totalImagesAfter={loteData.totalImagesAfter}
                  totalImagesBefore={loteData.totalImagesBefore}
                  loteDetailId={loteDetailId}
                  permission={permission}
                />
              </Card>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            {showHelp ? (
              <MDTypography color={ darkMode ? "white" :"dark"} sx={{fontSize:"16.6px"}}>
                <strong>{loteData.description} </strong> - Seleccioná una imágen
                para mostrar su información
              </MDTypography>
            ) : (
              ""
            )}

            {showSideImageInfo ? (
              <SideImageInfo
                imageNumber={imageNumber}
                imageData={imageData}
                loteDetailId={loteDetailId}
              />
            ) : (
              ""
            )}

            {loteEditionModal()}
          </GridItem>
        </>
      );
    }
  };

  return showContent();
}
