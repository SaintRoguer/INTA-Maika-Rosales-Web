import Admin from "layouts/Admin.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import makeStyles from '@mui/styles/makeStyles';
import useSWR from "swr";
import moment from "moment";
import "moment/locale/es";
import { CSVLink } from "react-csv";
import Button from "components/CustomButtons/Button.js";
import formatCsvDataAllSessions from "../../lib/formatCsvDataAllSessions";
import generatePdf from "../../lib/pdfGeneratorAllSessions";

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

const useStyles = makeStyles(styles);

function Sesiones() {
  const classes = useStyles();
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
    return <h3>Cargando..</h3>; //todo: Poner spinner?
  }

  let tableData = getTableData(data);

  return (
    <div>
      {tableData && tableData.length > 0 ? (
        <>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="dark">
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>
                      <h4 className={classes.cardTitleWhite}>
                        {" "}
                        Lista de sesiones creadas en la aplicación móvil.
                      </h4>
                      {tableData.length == 1 ? (
                        <p className={classes.cardCategoryWhite}>
                          Hay{" "}
                          <span style={{ color: "yellow" }}>
                            1 sesión creada.
                          </span>
                        </p>
                      ) : (
                        <p className={classes.cardCategoryWhite}>
                          Hay{" "}
                          <span style={{ color: "yellow" }}>
                            {tableData.length} sesiones creadas.
                          </span>
                        </p>
                      )}
                    </div>
                    {csvData && csvData.data ? (
                      <div
                        style={{
                          display: "inline-block",
                        }}
                      >
                        <CSVLink {...csvData}>
                          <Button color="rose" style={{ textAlign: "center" }}>
                            <strong>Descargar CSV</strong>
                          </Button>
                        </CSVLink>

                        <Button
                          color="success"
                          onClick={() => {
                            generatePdf(allInfo);
                          }}
                          style={{ textAlign: "center", marginLeft: "10px" }}
                        >
                          <strong>Descargar PDF</strong>
                        </Button>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </CardHeader>
                <CardBody>
                  <Table
                    tableHeaderColor="primary"
                    tableHead={[
                      { title: "Descripción", field: "description" },
                      { title: "Fecha", field: "date", editable: "never" },
                      {
                        title: "Creada por",
                        field: "creator",
                        editable: "never",
                      },
                      {
                        title: "Cantidad de lotes",
                        field: "numberOfLotes",
                        editable: "never",
                      },
                    ]}
                    tableData={tableData}
                  />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </>
      ) : (
        <>
          <h1 style={{ fontWeight: "bold" }}>
            {" "}
            Todavía no hay sesiones creadas
          </h1>
          <h3>
            {" "}
            ¡Bajá la{" "}
            <a
              href="https://drive.google.com/file/d/1R1gTdAKPZS6O2zv4WeTZM3sDXDmmssq3/view?usp=sharing"
              target="_blank"
            >
              app
            </a>{" "}
            y comenzá a crearlas!
          </h3>
        </>
      )}
    </div>
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
