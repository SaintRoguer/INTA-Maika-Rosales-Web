import ReactPlayer from "react-player";
import React from "react";

const dataWebInfo = {
  rows: [
    {
      title: (
        <p>
          <strong>¿Qué información puedo ver en esta web?</strong>
        </p>
      ),
      content: (
        <p>
          Podés ver toda la información que fue cargada por vos en la aplicación
          móvil o por otro usuario que te haya compartido su sesión. Es decir,
          sesiones, lotes, imágenes, pasturas, promedios, notas y alarmas de
          erosión eólica. En el apartado de <strong>Sesiones </strong> podras
          ver todas tus sesiones mientras que en el apartado de{" "}
          <strong>Compartidos Conmigo </strong>podras ver todas las sesiones que
          otros usuarios hayan compartido con vos. <br></br>Tendrás la
          posibilidad de buscar, filtrar y ordenar las sesiones por descripción,
          nombre del creador o creadora, fecha, etc. Ademas, vas a poder darle
          permisos a otros usuarios para que puedan ver o editar tus sesiones.
          <br></br>Por último, podes descargar la información en dos formatos:
          CSV y PDF
        </p>
      ),
    },
    {
      title: (
        <p>
          <strong>¿Puedo modificar contenido en esta web?</strong>
        </p>
      ),
      content: (
        <p>
          Vas a poder editar la descripción de una sesión, lote o pastura asi
          como las notas que estas tengan. Tambien los coeficientes para el
          calculo de la alarma de peligrosidad de erosión eólica. A diferencia
          de la aplicación móvil, en la web no permitimos eliminar sesiones,
          lotes, pasturas, imágenes o notas. Si bien ya esta implementado el
          sistema de usuarios, como no se pudo rehacer la aplicación movil para
          sea compatible con la web, la opción de eliminar de eliminar sigue sin
          estar disponible.
        </p>
      ),
    },
    {
      title: (
        <p>
          <strong>¿Cómo se utiliza un archivo CSV?</strong>
        </p>
      ),
      content: (
        <>
          <div>
            <p>
              Si trabajaste con Excel quizas alguna vez te tocó usar un archivo
              con formato CSV. Es un archivo de valores separados por comas.
              Permite almacenar los datos en forma de tabla separando cada
              columna con comas.
              <br />
              <br />
              Hicimos un video muy breve mostrando los pasos para obtener una
              tabla desde el archivo CSV:
            </p>
            <ReactPlayer url="https://www.youtube.com/watch?v=JYWMkSlTdUQ" />
            <br />
            <p>
              <strong>Resumiendo: </strong> 1) Crear nuevo libro en Excel - 2)
              Ir a "Datos" y elegir "Datos desde un archivo" - 3) Seleccionar el
              archivo que descargaste - 4) Elegir "Delimitados" - 5) Destildar
              "Tabulación" y tildar "Coma" - 6) Siguiente y Finalizar
            </p>
          </div>
        </>
      ),
    },
  ],
};

const styleWebInfo = (darkMode) => ({
  bgColor: darkMode ? "#1f283e" : "#EEEEE",
  rowTitleColor: darkMode ? "#ffffff" : "#1f283e",
  rowTitleTextSize: "large",
  rowContentColor: darkMode ? "#ffffff" : "#1D1D1D",
  rowContentTextSize: "18px",
  rowContentPaddingLeft: "50px",
  rowContentPaddingRight: "50px",
  arrowColor: darkMode ? "#ffffff" : "black",
});

export { dataWebInfo, styleWebInfo };
