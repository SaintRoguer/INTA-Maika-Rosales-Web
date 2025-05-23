import React from "react";
import { Icon, Tooltip } from "@mui/material";
import MDButton from "components/MDButton";
import ModalManager from "components/ModalManager/ModalManager";
import Card from "@mui/material/Card";
import { useModal } from "context/ModalContext";
import { useMaterialUIController } from "context";

export default function Alarms(props) {
  const {
    windVelocity: propWindVelocity,
    soilSensitivity: propSoilSensitivity,
    averageAfter,
    averageBefore,
    totalImagesAfter,
    totalImagesBefore,
    loteDetailId,
    permission,
  } = props;

  const { openModal, closeModal } = useModal();
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const editDescription = (color) => {
    return permission === "Editor" || permission === undefined ? (
      <MDButton
        variant="outlined"
        color={color}
        onClick={handleOpenChangeCoefficientsModal}
        sx={{ ml: 2 }} // Add margin between icon and button
      >
        <Icon>landslide</Icon>
        <strong>Cambiar coeficientes</strong>
      </MDButton>
    ) : (
      <MDButton
        variant="outlined"
        color="black"
        disabled
        sx={{ ml: 2 }} // Consistent spacing
      >
        <Icon>landslide</Icon>
        <strong>Cambiar coeficientes</strong>
      </MDButton>
    );
  };

  const [localCoefficients, setLocalCoefficients] = React.useState({
    windVelocity: propWindVelocity,
    soilSensitivity: propSoilSensitivity,
  });

  React.useEffect(() => {
    setLocalCoefficients({
      windVelocity: propWindVelocity,
      soilSensitivity: propSoilSensitivity,
    });
  }, [propWindVelocity, propSoilSensitivity]);

  const handleOpenChangeCoefficientsModal = () => {
    openModal("alarm", {
      onSubmit: handleChangeCoefficients,
      windVelocity: localCoefficients.windVelocity ?? 30,
      soilSensitivity: localCoefficients.soilSensitivity ?? 1,
      loteDetailId: loteDetailId,
    });
  };

  const handleChangeCoefficients = async (
    newWindVelocity,
    newSoilSensitivity,
    loteDetailId
  ) => {
    setLocalCoefficients({
      windVelocity: newWindVelocity,
      soilSensitivity: newSoilSensitivity,
    });
    document.body.style.cursor = "wait";
    try {
      const response = await fetch("/api/lotesDetails/changeCoefficients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          soilSensitivity: Number(newSoilSensitivity),
          windVelocity: Number(newWindVelocity),
          loteDetailId: loteDetailId,
        }),
      });

      if (response.ok) {
        document.body.style.cursor = "default";
        closeModal();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
    } catch (error) {
      console.error("Error changing coefficients:", error);
      openModal("error", { error: error.message });
    }
  };

  const calculateDangerIndex = () => {
    const windVel = localCoefficients.windVelocity ?? 30;
    const coverage =
      totalImagesAfter !== 0
        ? (averageAfter.totalGreen + averageAfter.totalYellow) /
          totalImagesAfter
        : (averageBefore.totalGreen + averageBefore.totalYellow) /
          totalImagesBefore;

    return (
      windVel *
      (1 - coverage / 100) *
      (localCoefficients.soilSensitivity ?? 0.5)
    );
  };

  const alarm = () => {
    if (totalImagesAfter === 0 && totalImagesBefore === 0) {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="El lote no posee imágenes">
            <Icon fontSize="large" color="warning">
              warning
            </Icon>
          </Tooltip>
        </div>
      );
    }

    if (localCoefficients.soilSensitivity === undefined) {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Tooltip title="El lote no posee el coeficiente de sensibilidad del suelo">
            <Icon fontSize="large" color="warning">
              warning
            </Icon>
          </Tooltip>
          {editDescription("warning")}
        </div>
      );
    }

    const dangerIndex = calculateDangerIndex();

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        {dangerIndex <= 20 ? (
          <Tooltip title="La erosión eólica es poco probable">
            <Icon fontSize="large" color="success">
              check_circle
            </Icon>
          </Tooltip>
        ) : dangerIndex <= 40 ? (
          <Tooltip title="La erosión eólica podría ser moderada dependiendo de las condiciones específicas del lote">
            <Icon fontSize="large" sx={{ color: "#ffc400" }}>
              warning
            </Icon>
          </Tooltip>
        ) : (
          <Tooltip title="Hay un riesgo significativo de erosión eólica">
            <Icon color="error" fontSize="large">
              error
            </Icon>
          </Tooltip>
        )}
        {editDescription("info")}
      </div>
    );
  };

  return (
    <Card
      style={{
        backgroundColor: darkMode ? "#1f283e" : "#42424a",
        borderRadius: "10px",
        padding: "1rem",
        marginBottom: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {alarm()}
        <ModalManager />
      </div>
    </Card>
  );
}
