import { toDate, format, getMinutes, getHours } from "date-fns";

export default function formatCsvDataAllSessions(allInfo) {
  // Check if allInfo exists and has sessions array
  if (!allInfo || !allInfo.sessions || allInfo.sessions.length === 0) {
    return;
  }
  console.log("allInfo", allInfo);

  const headers = [
    { label: "Sesión", key: "sessionDescription" },
    { label: "Fecha", key: "sessionCreationDate" },
    { label: "Creada por", key: "sessionCreator" },
    { label: "Cantidad de lotes", key: "totalLotes" },
    { label: "Cantidad de pasturas", key: "totalPasturas" },
    { label: "Total de imágenes (sueltas + en pasturas)", key: "totalImages" },
    { label: "Notas", key: "sessionNotes" },
  ];

  let data = [];
  // Use allInfo.sessions instead of allInfo
  allInfo.sessions.forEach((sessionInfo) => {
    const sessionDate = toDate(
      sessionInfo.date._seconds * 1000
    );
    const sessionFormattedDate =
      format(sessionDate, "dd/MM/yyyy") +
      " - " +
      getHours(sessionDate) +
      ":" +
      (getMinutes(sessionDate) < 10 ? '0' : '') + getMinutes(sessionDate) +
      "hs";

    let totalPasturas = 0;
    let totalImages = 0;
    sessionInfo.lotes.forEach((dataItem) => {
      totalImages +=
        dataItem.totalImagesBefore + dataItem.totalImagesAfter;

      if (dataItem.pasturas && dataItem.pasturas.length > 0) {
        totalPasturas += dataItem.pasturas.length;
      }
    });

    data.push({
      sessionDescription: sessionInfo.description,
      sessionCreationDate: sessionFormattedDate,
      sessionCreator: sessionInfo.user,
      totalLotes: sessionInfo.lotes.length,
      totalPasturas: totalPasturas,
      totalImages: totalImages,
      sessionNotes:
        sessionInfo.notes &&
        sessionInfo.notes.length > 0
          ? sessionInfo.sessionData.notes.join(" - ")
          : "La sesión no tiene notas generales",
    });
  });

  const csvReport = {
    data: data,
    headers: headers,
    filename: `CoberturaSuelos_TodasLasSesiones_${
      format(new Date(), "dd/MM/yyyy-HH:mm") + "hs"
    }.csv`,
  };

  return csvReport;
}