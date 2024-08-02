import React, { useState } from "react";
import { styled } from '@mui/material/styles';
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import LoteImages from "../LoteImages/LoteImages";
import SideImageInfo from "./SideImageInfo";
import LotePasturas from "../LotePasturas/LotePasturas";
import ImageIcon from "@mui/icons-material/Image";
import ArtTrackIcon from "@mui/icons-material/ArtTrack";
import AssessmentIcon from "@mui/icons-material/Assessment";
import moment from "moment";
import "moment/locale/es";
import { updateLote } from "../../lib/db-client";
import InfoAverage from "./InfoAverage";
import EditIcon from "@mui/icons-material/Edit";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import EditionModal from "../Modal/EditionModal";

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
  const { loteData, pasturasData, loteDetailId } = props;
  const [showSideImageInfo, setShowSideImageInfo] = useState(false);
  const [imageData, setImageData] = useState("");
  const [imageNumber, setImageNumber] = useState("");
  const [showHelp, setShowHelp] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);



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

  const cardHeader = () => {
    return (
      <CardHeader color="primary">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h4 className={classes.cardTitleWhite}>
            {loteData.description} - Creado a las{" "}
            {moment(
              new Date(loteData.creationDate._seconds * 1000),
              "dd/mm/yyyy"
            ).format("HH:mm")}{" "}
            hs
          </h4>
          {isMinimized ? (
            <div style={{ display: "flex" }}>
              <EditIcon
                onClick={() => {
                  setShowEditModal(true);
                }}
              />
              <ArrowDownwardIcon onClick={() => setIsMinimized(false)} />
            </div>
          ) : (
            <div style={{ display: "flex" }}>
              <EditIcon
                onClick={() => {
                  setShowEditModal(true);
                }}
              />
              <ArrowUpwardIcon
                onClick={() => {
                  setIsMinimized(true);
                }}
              />
            </div>
          )}
        </div>
      </CardHeader>
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
        (<Root>
          <GridItem xs={12} sm={12} md={6}>
            <Card chart>{cardHeader()}</Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}></GridItem>
          {loteEditionModal()}
        </Root>)
      );
    } else {
      return (
        <>
          <GridItem xs={12} sm={12} md={6}>
            <Card chart>
              {cardHeader()}
              <GridItem xs={12} sm={12} md={12}>
                <h5>
                  <strong>{loteData.images.length} imágenes</strong> y{" "}
                  <strong>{loteData.pasturas.length} pasturas</strong> asociadas
                </h5>
              </GridItem>

              <CardBody>
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
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={6}>
            {showHelp ? (
              <h5>
                <strong>{loteData.description} </strong> - Seleccioná una imágen
                para mostrar su información
              </h5>
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
