import React, { useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import SessionNotesTable from "components/Modal/SessionNoteModal/SessionNotesTable";
import { useMaterialUIController} from "context";
import MDTypography from "components/MDTypography";


export default function SessionNoteModal(props) {
  const [open, setOpen] = useState(true);
  const { onUpdate,sessionDetailIDDoc } = props;
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  let notesInfo = [];
  props.notes.map((note, index) => {
    notesInfo.push({
      id: index,
      note: note,
    });
  });

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
        <SessionNotesTable
          tableHead={[{ 
            accessorKey:"note",
            header:"Nota",
            size:"auto",
          }]}
          tableData={notesInfo}
          sessionDetailsId={props.sessionDetailsId}
          onUpdateData={handleUpdateNotes}
          sessionDetailIDoc={sessionDetailIDDoc}
        />
      );
    } else {
      return  <> 
                <MDTypography color= {darkMode? "white" : "black" } sx={{fontSize:"22.5px"}}>
                  La sesión no tiene ninguna nota. 
                </MDTypography>    
              </>;
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
  );
}
