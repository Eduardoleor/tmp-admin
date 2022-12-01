import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import bcrypt from "bcryptjs";
import { getCookies } from "cookies-next";
import { useSnackbar } from "react-simple-snackbar";

import { Box } from "@/components/system/Box";
import Layout from "@/components/system/Layout";
import ModalAddUsers from "@/components/users/ModalAddUsers";
import TableUsers from "@/components/users/TableUsers";
import TableUsersActions from "@/components/users/TableUsersActions";
import { Loading, Text } from "@nextui-org/react";

const UserCreate = () => {
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState(null);
  const [openModalAddUsers, setOpenModalAddUsers] = useState(false);
  const [loadingAddUsers, setLoadingAddUsers] = useState(false);
  const [userSelected, setUserSelected] = useState(null);
  const [loadingCell, setLoadingCell] = useState(false);

  const cookies = getCookies();
  const token = cookies?.token;

  const router = useRouter();
  const [openSnackbar] = useSnackbar();

  const callUsers = () => {
    axios
      .get("/api/users/list")
      .then((res) => {
        const sortedData = res.data?.data?.sort((p1: any, p2: any) =>
          p1.id < p2.id ? 1 : p1.id > p2.id ? -1 : 0
        );
        setUsers(sortedData);
      })
      .catch((err) => {
        setErrorUsers(err.response?.data?.message);
        openSnackbar(err.response?.data?.message);
      })
      .finally(() => setLoadingUsers(false));
  };

  const handleAddedUser = (user: any) => {
    setLoadingAddUsers(true);
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(user.password, salt);

    axios
      .post("/api/users/add", null, {
        params: {
          id: user.id,
          user_id: user.user_id,
          full_name: user.full_name,
          password: hashedPassword,
          role: user.role,
          jwt: salt,
          sign_date: new Date(),
          is_active: true,
        },
      })
      .then((res) => {
        if (res.data) {
          setOpenModalAddUsers(false);
          openSnackbar("User added successfully");
        } else {
          openSnackbar("Error adding user");
        }
      })
      .catch(() => {
        openSnackbar("Error adding user");
      })
      .finally(() => {
        setLoadingAddUsers(false);
        setOpenModalAddUsers(false);
        callUsers();
      });
  };

  const handleUpdateUser = (user: any) => {
    setLoadingAddUsers(true);
    axios
      .put("/api/users/update", null, {
        params: {
          id: user.id,
          user_id: user.user_id,
          full_name: user.full_name,
        },
      })
      .then((res) => openSnackbar("User updated successfully"))
      .catch((err) => openSnackbar(err.response?.data?.message))
      .finally(() => {
        setLoadingAddUsers(false);
        setOpenModalAddUsers(false);
        callUsers();
      });
  };

  const handleEditUser = (user: any) => {
    setUserSelected(user);
    setOpenModalAddUsers(true);
  };

  const handleDeleteUser = (id: string) => {
    axios
      .delete("/api/users/delete", { params: { id } })
      .then((res) => {
        if (res.data) {
          setOpenModalAddUsers(false);
          openSnackbar("User deleted successfully");
        } else {
          openSnackbar("Error deleting user");
        }
      })
      .catch(() => {
        openSnackbar("Error deleting user");
      })
      .finally(() => {
        setLoadingAddUsers(false);
        setOpenModalAddUsers(false);
        callUsers();
      });
  };

  const handleChangeStatus = (status: boolean, id: string) => {
    setLoadingCell(true);
    axios
      .put("/api/users/status", null, {
        params: {
          id,
          is_active: status,
        },
      })
      .then(() => {
        openSnackbar("User updated successfully ✅");
        callUsers();
      })
      .catch((err) => openSnackbar(err.response?.data?.message + " ❌"))
      .finally(() => setLoadingCell(false));
  };

  const handleCloseModalAddUsers = () => {
    setOpenModalAddUsers(false);
    setUserSelected(null);
  };

  useEffect(() => {
    if (!token) {
      router.push("/auth/sign_in");
    }
    setLoading(false);
  }, [router, token]);

  useEffect(() => {
    setLoadingUsers(true);
    callUsers();
  }, []);

  if (loading) {
    return (
      <Box
        css={{
          display: "flex",
          width: "100%",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loading size="md">Loading...</Loading>
      </Box>
    );
  }

  return (
    <Layout>
      <Text size="$xl" css={{ my: 20 }}>
        List of Users
      </Text>
      <TableUsersActions
        handleOpenModalAddUsers={() => setOpenModalAddUsers(true)}
      />
      <TableUsers
        users={users}
        loading={loadingUsers}
        loadingCell={loadingCell}
        error={errorUsers}
        onEditUser={handleEditUser}
        onToggleUserStatus={handleChangeStatus}
      />
      <ModalAddUsers
        open={openModalAddUsers}
        loading={loadingAddUsers}
        userSelected={userSelected}
        onClose={handleCloseModalAddUsers}
        onConfirm={handleAddedUser}
        onUpdate={handleUpdateUser}
        onDelete={handleDeleteUser}
      />
    </Layout>
  );
};

export default UserCreate;
