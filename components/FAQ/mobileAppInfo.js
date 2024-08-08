const dataAppInfo = (darkMode) => ({
  rows: [
    {
      title: (
        <p>
          <strong>¿Dónde puedo descargar la aplicación móvil?</strong>
        </p>
      ),
      content: (
        <p>
          Podés descargar el archivo .apk que instalará la aplicación en tu
          celular{" "}
          <a
            href="https://drive.google.com/file/d/1R1gTdAKPZS6O2zv4WeTZM3sDXDmmssq3/view?usp=sharing"
            target="_blank"
            style={{ color: darkMode ? "#ffffff" : "#1f283e", textDecoration: "underline !important",  fontWeight: "bold" }}

          >
            <strong>acá</strong>
          </a>
          . Al querer instalarla, posiblemente se te pida que{" "}
          <a
            href="https://miracomosehace.com/instalar-aplicaciones-externas-origen-desconocido-android/"
            target="blank"
            style={{ color: darkMode ? "#ffffff" : "#1f283e", textDecoration: "underline !important",  fontWeight: "bold" }}

          >
            habilites la opción de 'Instalar aplicaciones de origen
            desconocido'.
          </a>
        </p>
      ),
    },
  ],
});

const styleAppInfo = (darkMode) => ({
  bgColor: darkMode ? "#1f283e" : "#EEEEE",
  rowTitleColor: darkMode ? "#ffffff" : "#1f283e",
  rowTitleTextSize: "large",
  rowContentColor: darkMode ? "#ffffff" : "#1D1D1D",
  rowContentTextSize: "18px",
  rowContentPaddingLeft: "50px",
  rowContentPaddingRight: "50px",
  arrowColor: darkMode ? "#ffffff" : "black",
});

export { dataAppInfo, styleAppInfo };
