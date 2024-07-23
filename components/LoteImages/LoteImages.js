import React from "react";
import {Gallery} from "react-grid-gallery";

export default function LoteImages(props) {
  const { images } = props;

  const loteGallery = (imagesForGallery, imagesData) => {
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
          onClick={(index) => {
            props.onImageSelected(index + 1, imagesData[index]);
          }}
        />
      </div>
    );
  };

  const lotesImages = () => {
    if (images && images.length) {
      let imagesForGallery = [];
      let imageCount = 1;
      let imagesData = [];
      images.map((image) => {
        let imagePath = image.before.uri ? image.before.uri : "noimage";
        imagesForGallery.push({
          src: imagePath,
          alt: ".Lo sentimos. No se pudo cargar esta imágen.",
          width: 243,
          height: 190,
          caption: "Imagen " + imageCount + "- Click para ver más info",
        });
        imagesData.push(image);
        imageCount++;
      });

      return loteGallery(imagesForGallery, imagesData);
    } else if (props.showNoImagesAlertIfEmpty) {
      return <h5>El lote no tiene imágenes sueltas. ¡Revisá las pasturas!</h5>;
    }
  };

  return <div>{lotesImages()}</div>;
}
