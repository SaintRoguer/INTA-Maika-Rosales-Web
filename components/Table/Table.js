import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import styles from "assets/jss/nextjs-material-dashboard/components/tableStyle.js";
import MaterialTable from "material-table";
import { optionsConfig, localizationConfig } from "./config/tableConfig";
import router from "next/router";
import { updateSession } from "../../lib/db-client";

const useStyles = makeStyles(styles);

export default function CustomTable(props) {
  const classes = useStyles();
  const { tableHead, tableData } = props;

  const [columns, setColumns] = useState(tableHead);

  const goToSessionDetail = (rowData) => {
    /*router.push("/sesion/[id]", `/sesion/${rowData.id}`, {
      shallow: true,
    });*/
    window.location.replace(`/sesion/${rowData.id}`);
  };

  return (
    <div className={classes.tableResponsive}>
      <MaterialTable
        columns={columns}
        data={tableData}
        options={optionsConfig}
        localization={localizationConfig}
        onRowClick={(event, rowData) => goToSessionDetail(rowData)}
        editable={{
          isDeletable: () => false,
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(async () => {
                //Actualizo en firebase
                if (oldData.description !== newData.description) {
                  //Only session description is editable
                  await updateSession(
                    oldData.sessionId,
                    oldData.id,
                    newData.description
                  );
                }

                //La tabla se actualiza sola gracias a SWR
                resolve();
              }, 1000);
            }),
        }}
      />
    </div>
  );
}

CustomTable.propTypes = {
  tableHead: PropTypes.arrayOf(PropTypes.object),
  tableData: PropTypes.arrayOf(PropTypes.object),
};
