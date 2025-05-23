import React, { useState } from "react";
import {Gallery} from "react-grid-gallery";
import Percentages from "./Percentages";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import ImageNoteModal from "../Modal/ImageNoteModal/ImageNoteModal";
import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import MDButton from "components/MDButton";

import {
  useMaterialUIController,
} from "context";

export default function SideImageInfo(props) {
  const { imageNumber, imageData, loteDetailId } = props;

  const [showNotes, setShowNotes] = useState(false);

  let notes = transformImageNotes(imageData);

  const [notesData, setNotesData] = useState(notes);

  const loteGallery = (imagesForGallery) => {
    return (
      <div
        style={{
          display: "block",
          minHeight: "1px",
          width: "100%",
          border: "1px solid #ddd",
          overflow: "auto",
        }}
      >
        <Gallery
          images={imagesForGallery}
          enableImageSelection={false}
        />
      </div>
    );
  };

  const relatedImages = () => {
    let imagesForGallery = [];

    imagesForGallery.push({
      src: imageData.before.uri,
      width: 243,
      height: 190,
      caption: imageData.after
        ? "Imágen " + imageNumber + " - Antes"
        : "Imágen " + imageNumber,
    });

    if (imageData.after) {
      imagesForGallery[0].tags = [{ value: "Antes", title: "Antes" }];

      imagesForGallery.push({
        src: imageData.after.uri,
        width: 243,
        height: 190,
        caption: "Imágen " + imageNumber + " - Después",
        tags: [{ value: "Después", title: "Después" }],
      });
    }

    return loteGallery(imagesForGallery);
  };

  const imagesCover = () => {
    return <Percentages imageData={imageData} />;
  };

  const handleOnUpdate = (data) => {
    setNotesData(data);

  };
  const [controller, dispatch] = useMaterialUIController();
  const {
    darkMode,
  } = controller;

  return (
    <>
      <MDTypography color={ darkMode ? "white" :"dark"} sx={{fontSize:"13.4px"}}>
        <strong>Imágen {imageNumber} - Detalles</strong>
      </MDTypography>
      {relatedImages()}
      {imagesCover()}
      <MDTypography color= {darkMode? "white" : "black" } >  
            <div className="row" onClick={() => setShowNotes(true)}>
              <Icon style={{ marginBottom: -2 }} >speaker_notes</Icon>{" "}
                Ver{" "}
                <MDButton
                        onClick={() => setShowNotes(true)}
                        target="_blank"
                        rel="noreferrer"
                        color={darkMode? "white" : "black" }
                        variant="text"
                        size="large"
                        sx={{ whiteSpace: 'nowrap',minWidth:"max-content", padding:"0"}}

                      >
                <strong style={{ textDecoration: "underline" }}>
                  notas ({notes ? notes.length : 0})
                </strong>
                </MDButton>
                {" "}de la imágen
            </div>
            </MDTypography>
      {showNotes ? (
        <ImageNoteModal
          onCloseModal={async () => {
            setShowNotes(false);
          }}
          title="Notas de la imágen"
          notes={notesData}
          loteDetailId={loteDetailId}
          imageNumberInArray={imageNumber - 1}
          onUpdate={handleOnUpdate}
        />
      ) : (
        ""
      )}
    </>
  );
}

function transformImageNotes(imageData) {
  let notesInfo = [];
  if (imageData.before && imageData.after) {
    if (
      imageData.before.note !== "" &&
      imageData.before.note !== null &&
      imageData.after.note !== "" &&
      imageData.after.note !== null
    ) {
      notesInfo = [
        {
          originalNote: imageData.before.note,
          noteToDisplay: "Nota imágen antes: " + imageData.before.note,
          imageId: imageData.before.id,
        },
        {
          originalNote: imageData.after.note,
          noteToDisplay: "Nota imágen después: " + imageData.after.note,
          imageId: imageData.after.id,
        },
      ];
    } else if (imageData.before.note !== "" && imageData.before.note !== null) {
      notesInfo = [
        {
          originalNote: imageData.before.note,
          noteToDisplay: "Nota imágen antes: " + imageData.before.note,
          imageId: imageData.before.id,
        },
      ];
    } else if (imageData.after.note !== "" && imageData.after.note !== null) {
      notesInfo = [
        {
          originalNote: imageData.after.note,
          noteToDisplay: "Nota imágen después: " + imageData.after.note,
          imageId: imageData.after.id,
        },
      ];
    }
  } else {
    //no tiene una imágen del "despues"
    if (imageData.before.note !== "" && imageData.before.note !== null) {
      notesInfo = [
        {
          originalNote: imageData.before.note,
          noteToDisplay: imageData.before.note,
          imageId: imageData.before.id,
        },
      ];
    }
  }

  return notesInfo;
}
