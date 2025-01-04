import Admin from "layouts/Admin.js";
import Table from "components/TableAdmin/Table.js";
import Icon from "@mui/material/Icon";
import { useMaterialUIController} from "context";
import { getAllUsers } from "../../lib/db-admin";

export async function getServerSideProps() {
  try {
    const users = await getAllUsers();
    return {
      props: {
        users,
      },
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      props: {
        users: [],
      },
    };
  }
}


function Administrador({ users }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  return (

    <Table 
      tableHead={[
        { 
          accessorKey: "photoUrl",
          header: "",
          // Render images in a cell render
          size: 50, // small column
          Cell: ({ cell }) => {
            const imageUrl = cell.getValue();
            return imageUrl !== null ? (
              <img 
                src={imageUrl} 
                alt="Imagen" 
                style={{ 
                  width: "50px", 
                  height: "50px", 
                  borderRadius: "50%", 
                  objectFit: "cover" 
                }} 
              />
            ) : (
              <Icon 
                style={{ 
                  width: "50px", 
                  height: "50px", 
                  borderRadius: "50%", 
                  backgroundColor: darkMode ? "#e0e0e0" : "#1a2035!important" , 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontSize: "24px", 
                  color: darkMode ? "#000000" : "#FFFFFF!important" 
                }}
              >
                account_circle
              </Icon>
            );
          },
          enableSorting: false, 
          enableColumnActions: false,
        },
        { 
          accessorKey: "name", 
          header: "Usuario", 
        },
        { 
          accessorKey: "role", 
          header: "Rol", 
        },
      ]}
      tableData={users}
    />
  );
}

Administrador.layout = Admin;

export default Administrador;

