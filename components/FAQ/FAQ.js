import React from "react";
import Faq from "react-faq-component";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import makeStyles from '@mui/styles/makeStyles';
import { dataGeneralInfo, styleGeneralInfo } from "./generalInfo";
import { dataAppInfo, styleAppInfo } from "./mobileAppInfo";
import { dataWebInfo, styleWebInfo } from "./webInfo";

const styles = {
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
};

const useStyles = makeStyles(styles);

export default function FAQ() {
  const classes = useStyles();

  return (
    <>
      {/* Preguntas GENERALES */}
      <GridItem xs={12} sm={12} md={12}>
        <Card chart>
          <CardHeader color="primary">
            <div style={{ display: "flex" }}>
              <h4 className={classes.cardTitleWhite}>
                <strong>Generales</strong>
              </h4>
            </div>
          </CardHeader>

          <CardBody>
            <Faq data={dataGeneralInfo} styles={styleGeneralInfo} />
          </CardBody>
        </Card>
      </GridItem>

      {/* Preguntas APP MOBILE*/}
      <GridItem xs={12} sm={12} md={12}>
        <Card chart>
          <CardHeader color="dark">
            <div style={{ display: "flex" }}>
              <h4 className={classes.cardTitleWhite}>
                <strong>Aplicación Android</strong>
              </h4>
            </div>
          </CardHeader>

          <CardBody>
            <Faq data={dataAppInfo} styles={styleAppInfo} />
          </CardBody>
        </Card>
      </GridItem>

      {/* Preguntas WEB */}
      <GridItem xs={12} sm={12} md={12}>
        <Card chart>
          <CardHeader color="danger">
            <div style={{ display: "flex" }}>
              <h4 className={classes.cardTitleWhite}>
                <strong>Web</strong>
              </h4>
            </div>
          </CardHeader>

          <CardBody>
            <Faq data={dataWebInfo} styles={styleWebInfo} />
          </CardBody>
        </Card>
      </GridItem>
    </>
  );
}
