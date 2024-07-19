import React, { useState } from "react";
import makeStyles from '@mui/styles/makeStyles';
import styles from "assets/jss/nextjs-material-dashboard/components/tableStyle.js";
import MaterialTable from "material-table";
import { optionsConfig, localizationConfig } from "../config/tableConfig";
import { editItemFromArrayByDescription } from "../../../lib/db-client";

const useStyles = makeStyles(styles);

export default function SessionNotesTable(props) {
  const classes = useStyles();
  const { tableHead, tableData, sessionDetailsId } = props;
  const [columns, setColumns] = useState(tableHead);
  const [data, setData] = useState(tableData);

  return (
    <div>
      <div className={classes.tableResponsive}>
        <MaterialTable
          columns={columns}
          data={data}
          options={optionsConfig}
          localization={localizationConfig}
          editable={{
            isDeletable: () => false,
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(async () => {
                  //Actualizo en firebase
                  if (oldData.note !== newData.note) {
                    await editItemFromArrayByDescription(
                      "notes",
                      "sessionsDetails",
                      sessionDetailsId,
                      oldData.note,
                      newData.note
                    );
                  }

                  //Actualizo la tabla (en este caso lo hago manual porque el SWR no interviene)
                  const dataUpdate = [...data];
                  const index = oldData.tableData.id;
                  dataUpdate[index] = newData;
                  setData([...dataUpdate]);

                  //TODO: Do something like this to update note at real time?
                  // props.onUpdate(dataUpdate);
                  resolve();
                }, 1000);
              }),
          }}
        />
      </div>
    </div>
  );
}
