import { useEffect, useMemo, useState } from "react";
import { v4 } from "uuid";

import { isValidObj } from "@/utils/data";
import {
  Button,
  Dropdown,
  Input,
  Loading,
  Modal,
  Text,
} from "@nextui-org/react";

type ModalAddUsersProps = {
  open: boolean;
  loading: boolean;
  userSelected: User | null;
  onClose: () => void;
  onConfirm: (user: any) => void;
  onUpdate: (user: any) => void;
};

type User = {
  id: string;
  user_id: string;
  full_name: string;
  password: string;
  repeat_password: string;
  is_active: boolean;
};

const userDefault = {
  id: v4(),
  user_id: "",
  full_name: "",
  password: "",
  repeat_password: "",
  is_active: false,
};

const ModalAddUsers = ({
  open,
  loading,
  userSelected,
  onClose,
  onConfirm,
  onUpdate,
}: ModalAddUsersProps) => {
  const [user, setUser] = useState<User>(userDefault);

  const [selected, setSelected] = useState<any>(new Set(["employee"]));

  const selectedValue = useMemo(
    () => Array.from(selected).join(", ").replaceAll("_", " "),
    [selected]
  );

  useEffect(() => {
    if (userSelected) {
      setUser(userSelected);
    }
  }, [userSelected]);

  return (
    <Modal
      closeButton={!loading}
      preventClose={!loading}
      aria-labelledby="modal-title"
      open={open}
      onClose={onClose}
    >
      <Modal.Header>
        <Text id="modal-title" size={18}>
          {userSelected ? "Update User" : "Add User"}
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Text>ID</Text>
        <Input
          disabled
          placeholder="ID"
          value={user.id}
          onChange={(e) =>
            setUser({
              ...user,
              id: e.target.value,
            })
          }
        />
        <Text>Email</Text>
        <Input
          placeholder="Email"
          type="email"
          value={user.user_id}
          onChange={(e) =>
            setUser({
              ...user,
              user_id: e.target.value,
            })
          }
        />
        <Text>Full Name</Text>
        <Input
          placeholder="Full Name"
          type="text"
          value={user.full_name}
          onChange={(e) =>
            setUser({
              ...user,
              full_name: e.target.value,
            })
          }
        />
        {!userSelected && (
          <>
            <Text>Password</Text>
            <Input
              placeholder="Password"
              value={user.password}
              autoComplete="new-password"
              type="password"
              onChange={(e) =>
                setUser({
                  ...user,
                  password: e.target.value,
                })
              }
            />
            <Text>Repeat Password</Text>
            <Input
              placeholder="Repeat Password"
              value={user.repeat_password}
              autoComplete="new-password"
              type="password"
              css={{ mb: 25 }}
              onChange={(e) =>
                setUser({
                  ...user,
                  repeat_password: e.target.value,
                })
              }
            />
            <Dropdown>
              <Dropdown.Button color="primary" css={{ tt: "capitalize" }}>
                {selectedValue}
              </Dropdown.Button>
              <Dropdown.Menu
                aria-label="Single selection actions"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selected}
                onSelectionChange={setSelected}
              >
                <Dropdown.Item key="employee">Employee</Dropdown.Item>
                <Dropdown.Item key="administrator">Administrator</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          auto
          light
          onClick={() => {
            onClose();
            setUser(userDefault);
          }}
          disabled={loading}
        >
          Close
        </Button>
        <Button
          auto
          disabled={
            userSelected
              ? user.id.length === 0 ||
                user.user_id.length === 0 ||
                user.full_name.length === 0
              : user.id.length === 0 ||
                user.user_id.length === 0 ||
                user.full_name.length === 0 ||
                user.password !== user.repeat_password ||
                loading
          }
          onClick={() => {
            if (userSelected) {
              onUpdate(user);
              return;
            }
            onConfirm({ ...user, role: selectedValue });
            setUser(userDefault);
          }}
        >
          {loading ? (
            <Loading color="currentColor" size="sm" />
          ) : userSelected ? (
            "Update"
          ) : (
            "Add"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalAddUsers;
