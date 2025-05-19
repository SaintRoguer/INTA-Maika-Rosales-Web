import React from 'react';
import { Icon, Tooltip } from '@mui/material';
import MDButton from "components/MDButton";
import ModalManager from "components/ModalManager/ModalManager";
import Card from "@mui/material/Card";
import { useModal } from "context/ModalContext";
import { useMaterialUIController } from "context";
import { and } from 'firebase/firestore';


export default function Alarms(props) {
    const { 
        windVelocity: propWindVelocity, 
        soilSensitivity: propSoilSensitivity, 
        averageAfter, 
        averageBefore, 
        totalImagesAfter, 
        totalImagesBefore, 
        loteDetailId
    } = props;
    
    const { openModal, closeModal } = useModal();
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    
    // Local state with prop synchronization
    const [localCoefficients, setLocalCoefficients] = React.useState({
        windVelocity: propWindVelocity,
        soilSensitivity: propSoilSensitivity
    });

    // Sync local state when props change
    React.useEffect(() => {
        setLocalCoefficients({
            windVelocity: propWindVelocity,
            soilSensitivity: propSoilSensitivity
        });
    }, [propWindVelocity, propSoilSensitivity]);

    const handleOpenChangeCoefficientsModal = () => {
        openModal('alarm', {
            onSubmit: handleChangeCoefficients,
            windVelocity: localCoefficients.windVelocity ?? 30,
            soilSensitivity: localCoefficients.soilSensitivity ?? 1,
            loteDetailId: loteDetailId
        });
    };

    const handleChangeCoefficients = async(newWindVelocity, newSoilSensitivity, loteDetailId) => {
        // Update local state immediately for responsive UI
        setLocalCoefficients({
            windVelocity: newWindVelocity,
            soilSensitivity: newSoilSensitivity
        });
        document.body.style.cursor = 'wait';
         try {
            const response = await fetch('/api/lotesDetails/changeCoefficients', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({
                    soilSensitivity: Number(newSoilSensitivity),
                    windVelocity: Number(newWindVelocity),
                    loteDetailId: loteDetailId
                }),
            });

            if (response.ok) {
                document.body.style.cursor = 'default';
                closeModal();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }
            } catch (error) {
            console.error('Error changing coefficients:', error);
            openModal('error', { error: error.message });
         }
        
        
        // Here you would typically call your backend:
        // await api.updateCoefficients(newWindVelocity, newSoilSensitivity);
        console.log("Updated coefficients:", { newWindVelocity, newSoilSensitivity });      
    };

    const calculateDangerIndex = () => {
        const windVel = localCoefficients.windVelocity ?? 30;
        const coverage = totalImagesAfter === 0 
            ? (averageAfter.totalGreen + averageAfter.totalYellow) / totalImagesAfter 
            : (averageBefore.totalGreen + averageBefore.totalYellow) / totalImagesBefore;
        
        return windVel * (1 - (coverage / 100)) * (localCoefficients.soilSensitivity ?? 0.5);
    };

    const alarm = () => {
        if (totalImagesAfter === 0 && totalImagesBefore === 0) {
            return (
                <div>
                    <Tooltip title="El lote no posee imágenes">
                        <Icon color="warning">warning</Icon>
                    </Tooltip>
                </div>
            );
        }
        
        if (localCoefficients.soilSensitivity === undefined) {
            return (
                <div>
                    <Tooltip title="El lote no posee el coeficiente de sensibilidad del suelo">
                        <MDButton variant="outlined" color="warning" onClick={handleOpenChangeCoefficientsModal}>
                            <Icon>warning</Icon>
                            
                            <strong>Cambiar coeficientes</strong>
                        </MDButton>
                    </Tooltip>
                </div>
            );
        }

        const dangerIndex = calculateDangerIndex();

        if (dangerIndex <= 20) {
            return (
                <div>
                    <Tooltip title="La erosión eólica es poco probable">
                        <Icon color="success">check_circle</Icon>
                    </Tooltip>
                    <MDButton variant="outlined" color="info" onClick={handleOpenChangeCoefficientsModal}>
                            <Icon>landslide</Icon>
                            
                            <strong>Cambiar coeficientes</strong>
                    </MDButton>
                </div>
            );
        } else if (dangerIndex <= 40) {
            return (
                <div>
                    <Tooltip title="La erosión eólica podría ser moderada dependiendo de las condiciones específicas del lote">
                        <Icon sx={{ color: '#ffc400' }}>warning</Icon>                   
                    </Tooltip>
                     <MDButton variant="outlined" color="info" onClick={handleOpenChangeCoefficientsModal}>
                            <Icon>landslide</Icon>
                            
                            <strong>Cambiar coeficientes</strong>
                    </MDButton>
                </div>
            );
        } else {
            return (
                <div>
                    <Tooltip title="Hay un riesgo significativo de erosión eólica">
                        <Icon color="error">error</Icon>
                    </Tooltip>
                     <MDButton variant="outlined" color="info" onClick={handleOpenChangeCoefficientsModal}>
                            <Icon>landslide</Icon>
                            
                            <strong>Cambiar coeficientes</strong>
                    </MDButton>
                </div>
            );
        }
    };

    return (
        <>
            <Card style={{backgroundColor: darkMode ? "#1f283e" :'#42424a', borderRadius: "10px", padding: "1rem", marginBottom: "1rem"}}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {alarm()}
                    <ModalManager />
                </div>
            </Card>
        </>
    );
}