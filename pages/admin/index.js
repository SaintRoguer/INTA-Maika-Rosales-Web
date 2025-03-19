import Admin from "layouts/Admin.js";
import Table from "components/TableAdmin/Table.js";
import Icon from "@mui/material/Icon";
import { Avatar } from "@mui/material";
import { getAllUsers } from "../../lib/db-admin";
import { useEffect, useState } from "react";

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

async function getRoles() {
  const response = await fetch("/api/admin/getRoles");
  const data = await response.json();
  return data;
}

function Administrador({ users }) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true); 

  
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const fetchedRoles = await getRoles();
        setRoles(fetchedRoles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false); 
      }
    };
    fetchRoles();
  }, []);

  
  if (loading) {
    return <div> Cargando </div>;
  }

  return (
    <Table
      tableHead={[
        {
          accessorKey: "photoUrl",
          header: "",
          size: 50,
          Cell: ({ cell }) => {
            const imageUrl = cell.getValue();
            return imageUrl !== null ? (
              <Avatar alt="Avatar" src={imageUrl} sx={{ width: 40, height: 40 }} />
            ) : (
              <Avatar alt="Avatar" sx={{ width: 40, height: 40 }}>
                <Icon>account_circle</Icon>
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
          editVariant: "select",
          editSelectOptions: roles, 
        },
      ]}
      tableData={users}
      roles={roles}
    />
  );
}

Administrador.layout = Admin;

export default Administrador;