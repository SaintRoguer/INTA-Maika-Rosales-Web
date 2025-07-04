import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import LoteImages from "../LoteImages/LoteImages";
import CardFooter from "components/Card/CardFooter.js";
import { updatePastura } from "../../lib/db-client";
import AssessmentIcon from "@mui/icons-material/Assessment";
import InfoAverage from "components/LoteInfo/InfoAverage";
import EditIcon from "@mui/icons-material/Edit";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import EditionModal from "../Modal/EditionModal";
import moment from "moment";
import "moment/locale/es";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const PREFIX = "PasturaInfo";

const classes = {
  cardCategoryWhite: `${PREFIX}-cardCategoryWhite`,
  cardTitleWhite: `${PREFIX}-cardTitleWhite`,
};

const StyledGridItem = styled(GridItem)({
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

export default function PasturaInfo(props) {
  const { data, pasturaDetailId, onPasturaImageSelected } = props;

  const [isMinimized, setIsMinimized] = useState(false);
  const [showAverage, setShowAverage] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  async function handleEditPastura(newPasturaDescription) {
    setShowEditModal(false);
    await updatePastura(pasturaDetailId, newPasturaDescription);
    //TODO: Spinner?
  }

  // const cardHeader = () => {
  //   return (
  //     <CardHeader color="primary">
  //       <div style={{ display: "flex", justifyContent: "space-between" }}>
  //         <h4 className={classes.cardTitleWhite}>
  //           {data.description} - Creada a las{" "}
  //           {moment(
  //             new Date(data.creationDate._seconds * 1000),
  //             "dd/mm/yyyy"
  //           ).format("HH:mm")}{" "}
  //           hs{" "}
  //         </h4>
  //         {isMinimized ? (
  //           <ArrowDownwardIcon onClick={() => setIsMinimized(false)} />
  //         ) : (
  //           <div style={{ display: "flex" }}>
  //             <EditIcon
  //               onClick={() => {
  //                 setShowEditModal(true);
  //               }}
  //             />
  //             <ArrowUpwardIcon
  //               onClick={() => {
  //                 setIsMinimized(true);
  //               }}
  //             />
  //           </div>
  //         )}
  //       </div>
  //     </CardHeader>
  //   );
  // };

  const cardHeader = () => {
    return (
      <MDBox
        mx={2}
        mt={isMinimized ? "" : -3}
        py={3}
        px={2}
        mb={1}
        variant="gradient"
        bgColor="dark"
        borderRadius="lg"
        coloredShadow="dark"
        sx={{
          flexGrow: 1,
          direction: "row",
          minWidth: isMinimized ? "300px" : "",
        }}
      >
        <div style={{ display: "flex" }}>
          <MDTypography
            color="white"
            fontSize="15px"
            fontWeight="bold"
            sx={{ flexGrow: 1 }}
          >
            {data.description} - Creada a las{" "}
            {moment(
              new Date(data.creationDate._seconds * 1000),
              "dd/mm/yyyy"
            ).format("HH:mm")}{" "}
            hs
          </MDTypography>
          <MDTypography
            color="white"
            fontSize="15px"
            fontWeight="bold"
            justifySelf="flex-end"
          >
            {isMinimized ? (
              <ArrowDownwardIcon onClick={() => setIsMinimized(false)} />
            ) : (
              <div style={{ display: "flex" }}>
                <EditIcon onClick={() => setShowEditModal(true)} />
                <ArrowUpwardIcon onClick={() => setIsMinimized(true)} />
              </div>
            )}
          </MDTypography>
        </div>
      </MDBox>
    );
  };

  const cardFooter = () => {
    return (
      <CardFooter chart>
        <div>{showPasturaAverage()}</div>
      </CardFooter>
    );
  };

  const showTextNumberImages = () => {
    if (data.images.length > 1) {
      return (
        <h5>
          Esta pastura tiene <strong>{data.images.length} imágenes</strong>
        </h5>
      );
    } else if (data.images.length === 1) {
      return (
        <h5>
          Esta pastura tiene <strong> 1 imágen </strong>
        </h5>
      );
    } else {
      return (
        <h5>
          Esta pastura todavía <strong> no tiene imágenes</strong>
        </h5>
      );
    }
  };

  const showPasturaAverage = () => {
    return (
      <StyledGridItem xs={12} sm={12} md={12} style={{ marginBottom: 5 }}>
        {!showAverage ? (
          <div className="row" onClick={() => setShowAverage(true)}>
            <AssessmentIcon style={{ marginBottom: -2 }} />{" "}
            <a href="#" style={{ color: "black" }}>
              Ver{" "}
              <strong style={{ textDecoration: "underline" }}>promedios</strong>{" "}
              de la pastura
            </a>
          </div>
        ) : (
          <div className="row" onClick={() => setShowAverage(false)}>
            <AssessmentIcon style={{ marginBottom: -2 }} />{" "}
            <a href="#" style={{ color: "black" }}>
              <strong style={{ textDecoration: "underline" }}>Esconder</strong>{" "}
              promedios de la pastura
            </a>
          </div>
        )}

        {showAverage ? (
          <InfoAverage
            title={"Promedio de cobertura de la pastura"}
            averageAfter={data.averageAfter}
            averageBefore={data.averageBefore}
            totalImagesAfter={data.totalImagesAfter}
            totalImagesBefore={data.totalImagesBefore}
          />
        ) : (
          ""
        )}
      </StyledGridItem>
    );
  };

  const pasturaEditionModal = () => {
    if (showEditModal) {
      return (
        <EditionModal
          title={"Editar pastura"}
          onCloseModal={async () => {
            setShowEditModal(false);
          }}
          handleEditPastura={handleEditPastura}
        />
      );
    }
  };

  const showContent = () => {
    if (isMinimized) {
      return (
        <GridItem xs={12} sm={12} md={12}>
          <Card chart>
            <GridItem xs={12} sm={12} md={12}>
              {cardHeader()}
            </GridItem>
            {cardFooter()}
          </Card>
          {pasturaEditionModal()}
        </GridItem>
      );
    } else {
      return (
        <GridItem xs={12} sm={12} md={12}>
          <Card chart>
            <GridItem xs={12} sm={12} md={12}>
              {cardHeader()}

              {showTextNumberImages()}
            </GridItem>

            <CardBody>
              <LoteImages
                images={data.images}
                onImageSelected={onPasturaImageSelected}
              />
            </CardBody>
            {cardFooter()}
          </Card>
          {pasturaEditionModal()}
        </GridItem>
      );
    }
  };

  return showContent();
}
