import React, { useState } from "react";
import Gallery from "react-grid-gallery";
import Percentages from "./Percentages";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import ImageNoteModal from "../Modal/ImageNoteModal/ImageNoteModal";

export default function SideImageInfo(props) {
  const { imageNumber, imageData, loteDetailId } = props;

  const [showNotes, setShowNotes] = useState(false);

  let notes = transformImageNotes(imageData);

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
          backdropClosesModal={true}
        />
      </div>
    );
  };

  const relatedImages = () => {
    let imagesForGallery = [];

    imagesForGallery.push({
      src: imageData.before.uri,
      thumbnail: imageData.before.uri,
      thumbnailWidth: 243,
      thumbnailHeight: 190,
      caption: imageData.after
        ? "Imágen " + imageNumber + " - Antes"
        : "Imágen " + imageNumber,
    });

    if (imageData.after) {
      imagesForGallery[0].tags = [{ value: "Antes", title: "Antes" }];

      imagesForGallery.push({
        src: imageData.after.uri,
        thumbnail: imageData.after.uri,
        thumbnailWidth: 243,
        thumbnailHeight: 190,
        caption: "Imágen " + imageNumber + " - Después",
        tags: [{ value: "Después", title: "Después" }],
      });
    }

    return loteGallery(imagesForGallery);
  };

  const imagesCover = () => {
    return <Percentages imageData={imageData} />;
  };

  return (
    <>
      <h6>
        <strong>Imágen {imageNumber} - Detalles</strong>
      </h6>
      {relatedImages()}
      {imagesCover()}
      <div className="row" onClick={() => setShowNotes(true)}>
        <SpeakerNotesIcon style={{ marginBottom: -2 }} />{" "}
        <a href="#" style={{ color: "black" }}>
          Ver{" "}
          <strong style={{ textDecoration: "underline" }}>
            notas ({notes ? notes.length : 0})
          </strong>{" "}
          de la imágen
        </a>
      </div>
      {showNotes ? (
        <ImageNoteModal
          onCloseModal={async () => {
            setShowNotes(false);
          }}
          title="Notas de la imágen"
          notes={notes}
          loteDetailId={loteDetailId}
          imageNumberInArray={imageNumber - 1}
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
