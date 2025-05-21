import Icon from "@mui/material/Icon";

const allRoutes = [
  {
    path: "/sesiones",
    name: "Sesiones",
    icon: <Icon fontSize="small">computer</Icon>,
    layout: "/admin",
    access: ['common'] 
  },
  {
    path: "/compartidos",
    name: "Compartidos conmigo",
    icon: <Icon fontSize="small">group</Icon>,
    layout: "/admin",
    access: ['common']
  },
  {
    path: "/ayuda",
    name: "Ayuda",
    icon: <Icon fontSize="small">help</Icon>,
    layout: "/admin",
    access: ['common']
  },
  {
    path: "/admin",
    name: "Admin",
    icon: <Icon fontSize="small">admin_panel_settings</Icon>,
    layout: "/admin",
    access: ['admin']
  },
];

const getRoutesByRole = (role) => {
  if (!role) {
    return []};
  console.log("entre");
  return allRoutes.filter(route => {
    return route.access.includes(role);
  });
};

export default getRoutesByRole;