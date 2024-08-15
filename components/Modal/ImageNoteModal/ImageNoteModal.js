import React, { useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import ImageNotesTable from "components/Modal/ImageNoteModal/ImageNotesTable";
import { useMaterialUIController} from "context";
import MDTypography from "components/MDTypography";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center",
};

export default function ImageNoteModal(props) {
  const [open, setOpen] = React.useState(true);
  const { onUpdate } = props;
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;


  const onCloseModal = () => {
    setOpen(false);
    props.onCloseModal();
  };

  const handleUpdateNotes = (data) => {
    onUpdate(data);

  };

  const showNotes = () => {
    if (props.notes && props.notes.length > 0) {
      return (
        <ImageNotesTable
          tableHead={[{ 
            accessorKey: "noteToDisplay",
            header: "Nota", 
            size: "auto" 
          }
        ]}
          tableData={props.notes}
          loteDetailId={props.loteDetailId}
          imageNumberInArray={props.imageNumberInArray}
          onUpdateData={handleUpdateNotes}
        />
      );
    } else {
      return <MDTypography color= {darkMode? "white" : "black" } sx={{fontSize:"22.5px"}}>
                  La imágen no tiene ninguna nota. 
                </MDTypography>
    }
  };

  return (
    <div>
      <SweetAlert
        title={<MDTypography color= {darkMode? "white" : "black" } style={{fontSize:"37.5px"}}>{props.title}</MDTypography>}
        onConfirm={() => {}}
        onCancel={() => onCloseModal()}
        custom
        showConfirm={false}
        showCancel={false}
        showCloseButton
        style={{backgroundColor: darkMode ? "rgba(32,41,64, 1)" : "rgba(255, 255, 255, 1)"}}

      >
        {showNotes()}
      </SweetAlert>
    </div>
    // <div style={styles}>
    //   <Modal open={open} onClose={() => onCloseModal()} center>
    //     <h3>{props.title}</h3>
    //     {showNotes()}
    //   </Modal>
    // </div>
  );
}
