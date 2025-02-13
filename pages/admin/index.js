import Admin from "layouts/Admin.js";
import Table from "components/TableAdmin/Table.js";
import Icon from "@mui/material/Icon";
import { Avatar } from "@mui/material";
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
              <Avatar alt="Avatar" src={imageUrl}  sx={{ width: 40, height: 40 }}/>
            ) : (
              <Avatar alt="Avatar"  sx={{ width: 40, height: 40 }} >
              <Icon 
              >
                account_circle
              </Icon>
              </Avatar>
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
          accessorKey: "email", 
          header: "Email", 
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

