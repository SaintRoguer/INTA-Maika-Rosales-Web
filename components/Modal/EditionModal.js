import React, { useEffect, useState } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import Button from "components/CustomButtons/Button.js";

export default function LoteModal(props) {
  const [open, setOpen] = useState(true);

  const onCloseModal = () => {
    setOpen(false);
    props.onCloseModal();
  };

  return (
    <div>
      <SweetAlert
        input
        showCancel
        title={props.title}
        placeHolder="Nueva descripción..."
        onConfirm={(response) =>
          props.handleEditLote
            ? props.handleEditLote(response)
            : props.handleEditPastura(response)
        }
        onCancel={onCloseModal}
        confirmBtnText="Guardar"
        cancelBtnText="Cancelar"
      >
        Nueva descripción:
      </SweetAlert>
    </div>
  );
}
