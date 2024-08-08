import React from "react";
import { styled } from '@mui/material/styles';
import Faq from "react-faq-component";
import GridItem from "components/Grid/GridItem.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import { dataGeneralInfo, getStyleGeneralInfo } from "./generalInfo";
import { dataAppInfo, styleAppInfo } from "./mobileAppInfo";
import { dataWebInfo, styleWebInfo } from "./webInfo";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { useMaterialUIController} from "context";


const PREFIX = 'FAQ';

export default function FAQ() {


const [controller] = useMaterialUIController();
const { darkMode } = controller;



  return (    
  <MDBox mt={6} mb={3}>
    <Grid container spacing={4} justifyContent="center">

      {/* Preguntas GENERALES */}
      <Grid item xs={12} lg={8} >
        <Card>
        <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
            <MDTypography variant="h6" color="white">
              PREGUNTAS GENERALES
            </MDTypography>
          </MDBox>
          <MDBox pt={2} px={2} pb={2}>
            <Faq data={dataGeneralInfo(darkMode)} styles={getStyleGeneralInfo(darkMode)} />
          </MDBox>
        </Card>
      </Grid>

      {/* Preguntas APP MOBILE*/}
      <Grid item xs={12} lg={8}>
        <Card>
        <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="warning"
                borderRadius="lg"
                coloredShadow="warning"
              >
             <MDTypography variant="h6" color="white">PREGUNTAS APP MOBILE</MDTypography>
          </MDBox>
          <MDBox pt={2} px={2} pb={2}>
            <Faq data={dataAppInfo(darkMode)} styles={styleAppInfo(darkMode)} />
          </MDBox>
        </Card>
      </Grid>


      {/* Preguntas WEB */}
      <Grid item xs={12} lg={8}>
        <Card>
        <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="error"
                borderRadius="lg"
                coloredShadow="error"
              >
             <MDTypography variant="h6" color="white">PREGUNTAS WEB</MDTypography>
          </MDBox>
          <MDBox pt={2} px={2} pb={2}>
            <Faq data={dataWebInfo} styles={styleWebInfo(darkMode)} />
          </MDBox>
        </Card>
      </Grid>

    </Grid>
  </MDBox>
    
  );
}
