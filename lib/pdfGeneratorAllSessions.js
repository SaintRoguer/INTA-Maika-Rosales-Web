import jsPDF from "jspdf";
import "jspdf-autotable";
import { toDate, format, getMinutes, getHours } from "date-fns";

const generatePDF = (allInfo) => {
  if (!allInfo || allInfo.length == 0) {
    return;
  }

  console.log('allInfo', allInfo);

  // initialize jsPDF
  const doc = new jsPDF("p", "mm", "a4");

  // define the columns we want and their titles
  const tableColumn = [
    "Sesión",
    "Fecha",
    "Creado por",
    "Cantidad de lotes",
    "Cantidad de pasturas",
    "Total de imágenes (sueltas + en pasturas)",
    "Notas",
  ];

  // define an empty array of rows
  const tableRows = [];

  allInfo.map((sessionInfo) => {
    const sessionDate = toDate(
      sessionInfo.date._seconds * 1000
    );
    const sessionFormattedDate =
      format(sessionDate, "dd/MM/yyyy") +
      " - " +
      getHours(sessionDate) +
      ":" +
      getMinutes(sessionDate) +
      "hs";

    let totalPasturas = 0;
    let totalImages = 0;
    sessionInfo.lotes.map((data) => {
      console.log('data', data);
      totalImages +=
        data.totalImagesBefore + data.totalImagesAfter;

      if (data.pasturas && data.pasturas.length > 0) {
        totalPasturas += data.pasturas.length;
      }
    });

    const sessionData = [
      sessionInfo.description,
      sessionFormattedDate,
      sessionInfo.user,
      sessionInfo.lotes.length,
      totalPasturas,
      totalImages,
      sessionInfo.notes.length > 0
        ? sessionInfo.notes.join(" - ")
        : "La sesión no tiene notas generales",
    ];

    tableRows.push(sessionData);
  });

  let options = {
    styles: {
      halign: "center",
    },
    startY: 30,
  };
  // startY is basically margin-top
  doc.autoTable(tableColumn, tableRows, options);

  // document title. and margin-top + margin-left
  doc.setFontSize(20);
  doc.text("Lista de sesiones", 14, 15);
  doc.setFontSize(12);
  doc.text("Fecha de descarga: " + format(new Date(), "dd/MM/yyyy"), 14, 20);

  doc.save(
    `CoberturaSuelos_TodasLasSesiones_${
      format(new Date(), "dd/MM/yyyy-HH:mm") + "hs"
    }.pdf`
  );
};

export default generatePDF;
