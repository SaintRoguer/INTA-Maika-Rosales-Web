import Image from "next/image";

const dataGeneralInfo = (darkMode) => ({
  rows: [
    {
      title: (
        <p>
          <strong>¿Qué es CGS?</strong>
        </p>
      ),
      content: (
        <>
          <div
            className={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src="/cgs-logo-full.png"
              alt="logo cgs"
              width={500}
              height={500}
              className={{
                width: "60%",
              }}
            />
          </div>

          <p>
            CGS es la sigla para{" "}
            <strong>"Cobertura y gestión de suelos"</strong> y consiste en una
            aplicación para dispositivos Android en conjunto con esta página
            web. Ambas herramientas te ayudarán a llevar un registro del
            cubrimiento de vegetación presente en un suelo. Este procesamiento
            se lleva a cabo identificando en qué proporción aparecen los colores
            de las gamas del verde, amarillo/gris y marrón en las distintas
            imágenes analizadas. El resultado final que obtendrás para cada
            imagen será un porcentaje de "Vivo", otro de "Seco" y otro de
            "Desnudo". Estas imágenes las podrás asociar a distintas pasturas,
            lotes y sesiones, para poder accederlas en cualquier momento desde
            esta web o desde la aplicación móvil.
          </p>
        </>
      ),
    },
    {
      title: (
        <p>
          <strong>¿Cómo se llegó a desarrollar CGS?</strong>
        </p>
      ),
      content: (
        <p>
          CGS nace de la colaboración entre el{" "}
          <a 
            href="https://www.argentina.gob.ar/inta" 
            target="_blank" 
            style={{ color: darkMode ? "#ffffff" : "#1f283e", textDecoration: "underline !important",  fontWeight: "bold" }}
          >
            INTA
          </a>{" "}
          y el{" "}
          <a 
            href="https://cs.uns.edu.ar/home/" 
            target="_blank" 
            style={{ color: darkMode ? "#ffffff" : "#1f283e", textDecoration: "underline !important",  fontWeight: "bold" 
            }}
          >
            Departamento de Ciencias e Ingeniería de la Computación
          </a>{" "}
          de la Universidad Nacional del Sur, Bahía Blanca. La idea original del
          proyecto es de{" "}
          <a 
            href="http://cs.uns.edu.ar/~mll/web/" 
            target="_blank" 
            style={{ color: darkMode ? "#ffffff" : "#1f283e", textDecoration: "underline", fontWeight: "bold"  }}
          >
            Martin Larrea
          </a>
          , en representación del Departamento de Ciencias e Ingeniería de la
          Computación y de{" "}
          <a
            href="https://www.researchgate.net/profile/Geronimo_De_Leo"
            target="_blank"
            style={{ color: darkMode ? "#ffffff" : "#1f283e", textDecoration: "underline", fontWeight: "bold" }}
          >
            Gerónimo De Leo
          </a>
          , en representación del INTA, extensión Bahía Blanca. Esta idea fue
          implementada como Proyecto Final de carrera de la carrera Ingeniería
          en Sistemas de Información por los alumnos Juan Jouglard y Matias
          Massetti, bajo la dirección de Martin Larrea y Dana Uribarri.
        </p>
      ),
    },
    {
      title: (
        <p>
          <strong>
            Tengo preguntas, comentarios o sugerencias sobre la aplicación
            Android o sobre esta web. ¿Cómo me puedo comunicar?.
          </strong>
        </p>
      ),
      content: (
        <p>
          En la parte superior derecha en esta web hay un botón con el símbolo
          de una rueda, al presionarlo encontrarás la opción{" "}
          <strong>'Dar feedback'</strong>. También podés comunicarte por mail,
          escribiendo a las siguientes direcciones: jouglardjuan@gmail.com /
          matiasmassetti@gmail.com .
        </p>
      ),
    },
  ],
});



const getStyleGeneralInfo = (darkMode) => ({
  bgColor: darkMode ? "#1f283e" : "#EEEEE",
  rowTitleColor: darkMode ? "#ffffff" : "#1f283e",
  rowTitleTextSize: "large",
  rowContentColor: darkMode ? "#ffffff" : "#1D1D1D",
  rowContentTextSize: "18px",
  rowContentPaddingLeft: "50px",
  rowContentPaddingRight: "50px",
  arrowColor: darkMode ? "#ffffff" : "black",
});

export { dataGeneralInfo, getStyleGeneralInfo };

