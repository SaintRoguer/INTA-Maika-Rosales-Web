import React, { useState } from "react";
import makeStyles from '@mui/styles/makeStyles';
import styles from "assets/jss/nextjs-material-dashboard/components/tableStyle.js";
import MaterialTable from "material-table";
import { optionsConfig, localizationConfig } from "../config/tableConfig";
import { editNoteFromImage } from "../../../lib/db-client";

const useStyles = makeStyles(styles);

export default function ImageNotesTable(props) {
  const classes = useStyles();
  const { tableHead, tableData, loteDetailId, imageNumberInArray } = props;
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
                  if (oldData.noteToDisplay !== newData.noteToDisplay) {
                    await editNoteFromImage(
                      loteDetailId,
                      oldData.originalNote,
                      oldData.imageId,
                      imageNumberInArray,
                      newData.noteToDisplay
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
