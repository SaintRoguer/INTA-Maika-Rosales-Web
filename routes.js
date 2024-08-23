/*!

=========================================================
* * NextJS Material Dashboard v1.0.0 based on Material Dashboard React v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-material-dashboard
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/nextjs-material-dashboard/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "@mui/icons-material/Dashboard";
import Help from "@mui/icons-material/Help";

const dashboardRoutes = [
  {
    path: "/sesiones",
    name: "Sesiones",
    icon: Dashboard,
    layout: "/admin",
  },
  {
    path: "/ayuda",
    name: "Ayuda",
    icon: Help,
    layout: "/admin",
  },
];

export default dashboardRoutes;
