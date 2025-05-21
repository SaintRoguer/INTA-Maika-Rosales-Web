import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';

import Sidenav from "components/Sidenav";
import Footer from "components/Footer copy";
import Configurator from "components/Configurator";
import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import logo from "assets/img/logo.png";
import theme from "assets/theme";
import themeDark from "assets/theme-dark";
import { ThemeProvider } from "@mui/material/styles";
import useSWR from "swr";
import getRoutesByRole from "routes";

export default function Admin({ children, ...rest }) {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const router = useRouter();
  const { pathname } = router;
  
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const { data: role, error: roleError, isLoading } = useSWR(
    `/api/routes/routesPermission`
  );

  const roledRoutes = React.useMemo(() => {
    if (isLoading) return []; // or return loadingRoutes if you want
    if (!role) return []; // if no role (error case)
    return getRoutesByRole(role.role);
    }, [role, isLoading]);

  const transformedRoutes = roledRoutes.map(route => ({
    type: "collapse",
    name: route.name,
    key: route.path.substring(1),
    icon: route.icon,
    route: route.path,
    component: <Admin />,
  }));
  
  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <Sidenav
        color={sidenavColor}
        brand={(transparentSidenav && !darkMode) || whiteSidenav ? logo : logo}
        brandName="CGS"
        routes={transformedRoutes}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      />
      <Configurator />
      <DashboardLayout>
        <DashboardNavbar />
        <>{children}</>
        <Footer />
      </DashboardLayout>
    </ThemeProvider>
  );
}
