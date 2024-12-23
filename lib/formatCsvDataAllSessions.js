import { toDate, format, getMinutes, getHours } from "date-fns";

export default function formatCsvDataAllSessions(allInfo) {
  if (!allInfo || allInfo.length == 0) {
    return;
  }

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
  allInfo.map((sessionInfo) => {
    const sessionDate = toDate(
      sessionInfo.sessionData.creationDate._seconds * 1000
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
    sessionInfo.lotesAndPasturasData.data.map((data) => {
      totalImages +=
        data.loteData.totalImagesBefore + data.loteData.totalImagesAfter;

      if (data.loteData.pasturas.length > 0) {
        totalPasturas += data.loteData.pasturas.length;
      }
    });

    data.push({
      sessionDescription: sessionInfo.sessionData.description,
      sessionCreationDate: sessionFormattedDate,
      sessionCreator: sessionInfo.sessionData.user,
      totalLotes: sessionInfo.lotesAndPasturasData.data.length,
      totalPasturas: totalPasturas,
      totalImages: totalImages,
      sessionNotes:
        sessionInfo.sessionData.notes &&
        sessionInfo.sessionData.notes.length > 0
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
