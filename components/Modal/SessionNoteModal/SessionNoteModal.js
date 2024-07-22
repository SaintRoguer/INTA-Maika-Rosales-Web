import React, { useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import SessionNotesTable from "components/Modal/SessionNoteModal/SessionNotesTable";

export default function SessionNoteModal(props) {
  const [open, setOpen] = useState(true);
  const { onUpdate,sessionDetailIDDoc } = props;
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
      return <p> La sesión no tiene ninguna nota. </p>;
    }
  };

  return (
    <div>
      <SweetAlert
        title={props.title}
        onConfirm={() => {}}
        onCancel={() => onCloseModal()}
        custom
        showConfirm={false}
        showCancel={false}
        showCloseButton
      >
        {showNotes()}
      </SweetAlert>
    </div>
  );
}
