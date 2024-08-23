import React from "react";
import PercentagesCard from "./PercentagesCard/PercentagesCard";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem.js";
import MDTypography from "components/MDTypography";
import {
  useMaterialUIController,
} from "context";

export default function InfoAverage(props) {
  const {
    title,
    averageBefore,
    averageAfter,
    totalImagesBefore,
    totalImagesAfter,
  } = props;
  const [controller, dispatch] = useMaterialUIController();
  const {
    darkMode,
  } = controller;

  const percentagesBefore = getPercentagesBefore(
    averageBefore,
    totalImagesBefore
  );
  const percentagesAfter = getPercentagesAfter(averageAfter, totalImagesAfter);

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
        <MDTypography color={ darkMode ? "white" :"dark"} sx={{fontSize:"23.4px"}}>
            <strong>{title}</strong>
         </MDTypography>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <PercentagesCard
            title={"Antes"}
            percentages={percentagesBefore}
            isAverage={true}
          />
          <MDTypography color={ darkMode ? "white" :"dark"} sx={{fontSize:"13.4px"}}>
            <strong>Cantidad de imágenes antes: {totalImagesBefore}</strong>
            </MDTypography>
            </GridItem>

        <GridItem xs={12} sm={12} md={6}>
          <PercentagesCard
            title={"Después"}
            percentages={percentagesAfter}
            isAverage={true}
          />
          <MDTypography color={ darkMode ? "white" :"dark"} sx={{fontSize:"13.4px"}}>
          <strong>Cantidad de imágenes después: {totalImagesAfter}</strong>
          </MDTypography>
          </GridItem>
      </GridContainer>
    </div>
  );
}

function getPercentagesBefore(averageBefore, totalImagesBefore) {
  let percentagesBefore;
  if (totalImagesBefore > 0) {
    percentagesBefore = {
      percentageGreen: averageBefore.totalGreen / totalImagesBefore,
      percentageYellow: averageBefore.totalYellow / totalImagesBefore,
      percentageNaked: averageBefore.totalNaked / totalImagesBefore,
    };
  } else {
    percentagesBefore = {
      percentageGreen: 0,
      percentageYellow: 0,
      percentageNaked: 0,
    };
  }
  return percentagesBefore;
}

function getPercentagesAfter(averageAfter, totalImagesAfter) {
  let percentagesAfter;
  if (totalImagesAfter > 0) {
    percentagesAfter = {
      percentageGreen: averageAfter.totalGreen / totalImagesAfter,
      percentageYellow: averageAfter.totalYellow / totalImagesAfter,
      percentageNaked: averageAfter.totalNaked / totalImagesAfter,
    };
  } else {
    percentagesAfter = {
      percentageGreen: 0,
      percentageYellow: 0,
      percentageNaked: 0,
    };
  }

  return percentagesAfter;
}
