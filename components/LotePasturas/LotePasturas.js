import React from "react";
import PasturaInfo from "./PasturaInfo";
import MDTypography from "components/MDTypography";
import { fontSize } from "@mui/system";
import {
  useMaterialUIController,
} from "context";

export default function LotePasturas({ pasturasData, onPasturaImageSelected }) {
  const [controller, dispatch] = useMaterialUIController();
  const {
    darkMode,
  } = controller;
  const lotesInfo = () => {
    pasturasData.sort(
      (dataA, dataB) =>
        new Date(dataB.data.creationDate._seconds * 1000).getTime() -
        new Date(dataA.data.creationDate._seconds * 1000).getTime()
    );
    if (pasturasData.length > 0) {
      return (
        <>
          {pasturasData.map((pastura) => (
            <PasturaInfo
              {...pastura}
              key={pastura.pasturaDetailId}
              onPasturaImageSelected={onPasturaImageSelected}
            />
          ))}
        </>
      );
    } else {
      return <MDTypography color={ darkMode ? "white" :"dark"} sx={{fontSize:"16.6px"}}>El lote no tiene ninguna pastura.</MDTypography>;
    }
  };

  return <div>{lotesInfo()}</div>;
}
