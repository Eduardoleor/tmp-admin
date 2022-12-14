import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";

import { EditIcon } from "@/components/Icons//EditIcon";
import { Box } from "@/components/system/Box";
import { IconButton } from "@/components/system/IconButton";
import {
  Col,
  Loading,
  Row,
  Switch,
  Table,
  Text,
  Tooltip,
} from "@nextui-org/react";

type User = {
  id: number;
  email: string;
  full_name: string;
  role: string;
  jwt: string;
  is_active: boolean;
  user_id: string;
};

type TableUsersProps = {
  users: User[];
  loading: boolean;
  loadingCell: boolean;
  error: string | null;
  onEditUser: (user: User) => void;
  onToggleUserStatus: (status: boolean, id: string) => void;
};

const TableUsers = ({
  users,
  loading,
  loadingCell,
  error,
  onEditUser,
  onToggleUserStatus,
}: TableUsersProps) => {
  const cookie = JSON.parse(getCookie("user", undefined) as string);
  const { user } = cookie;
  const { id } = user;

  const columns = [
    { name: "ID", uid: "id" },
    { uid: "user_id", name: "Employee ID" },
    { uid: "full_name", name: "Full Name" },
    { uid: "role", name: "Role" },
    { uid: "is_active", name: "Active" },
    { uid: "actions", name: "Actions" },
  ];

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

  if (error) {
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
        <Text>There is an error getting the information</Text>
      </Box>
    );
  }

  const renderCell = (user: any, columnKey: any) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case "role":
        return (
          <Row justify="center" align="center">
            <Col css={{ d: "flex" }}>
              <Text transform="capitalize">{cellValue}</Text>
            </Col>
          </Row>
        );
      case "is_active":
        return (
          <Row justify="center" align="center">
            <Col css={{ d: "flex" }}>
              {!loadingCell ? (
                <Switch
                  checked={cellValue}
                  onChange={(s) =>
                    onToggleUserStatus(s.target.checked, user.id)
                  }
                  disabled={user.id === id}
                />
              ) : (
                <Loading type="spinner" color="currentColor" size="sm" />
              )}
            </Col>
          </Row>
        );
      case "actions":
        return (
          <Row justify="center" align="center">
            <Col css={{ d: "flex" }}>
              <Tooltip content={user.id === id ? "Current User" : "Edit User"}>
                <IconButton
                  onClick={() => onEditUser(user)}
                  disabled={user.id === id}
                >
                  <EditIcon size={20} fill="#979797" />
                </IconButton>
              </Tooltip>
            </Col>
          </Row>
        );
      default:
        return cellValue;
    }
  };

  return (
    <>
      {!loading && users?.length > 0 ? (
        <Table
          aria-label="table-users"
          color="secondary"
          selectionMode="none"
          containerCss={{
            height: "auto",
            minWidth: "100%",
          }}
        >
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column key={column.uid}>{column.name}</Table.Column>
            )}
          </Table.Header>
          <Table.Body items={users}>
            {(item) => (
              <Table.Row>
                {(columnKey) => (
                  <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
                )}
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      ) : (
        <Text>No users found</Text>
      )}
    </>
  );
};

export default TableUsers;
