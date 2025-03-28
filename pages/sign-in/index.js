import { useState } from "react";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import useSWR from "swr";

// Import the userLogin function
import { userLogin } from "../../lib/db-client"; // Update with the actual path
import { NextResponse } from "next/server";
import { useRouter } from "next/router";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const cookie = require("cookie");
  const router = useRouter();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message

    try {
      const { token, uid } = await userLogin(email, password);

      const response = await fetch("/api/sign-in/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, uid }),
      });

      if (!response.ok) {
        throw new Error("Error al iniciar sesión");
      }

      const data = await response.json(); // Leer la respuesta del backend
      const role = data.role; // Obtener el rol

      // 🌟 Redirigir según el rol obtenido
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/sesiones");
      }
    } catch (error) {
      if (error.message === "Firebase: Error (auth/invalid-credential).") {
        setErrorMessage("Email y/o contraseña incorrecta");
      } else {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <BasicLayout image={bgImage["src"]}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography
            variant="h4"
            fontWeight="medium"
            color="white"
            mt={1}
            mb={2}
          >
            Iniciar sesión
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleLogin}>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </MDBox>
            {errorMessage && (
              <MDBox mt={2}>
                <MDTypography variant="caption" color="error">
                  {errorMessage}
                </MDTypography>
              </MDBox>
            )}
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                INICIAR SESIÓN
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default SignIn;
