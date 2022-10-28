import { useState } from "react";

import { Button, Input, Modal, Text } from "@nextui-org/react";

type ModalPackingsDeleteProps = {
  open: boolean;
  password: string;
  onClose: () => void;
  onConfirm: () => void;
};

const ModalPackingsDelete = ({
  open,
  password,
  onClose,
  onConfirm,
}: ModalPackingsDeleteProps) => {
  const [passwordInput, setPasswordInput] = useState("");

  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={open}
      onClose={onClose}
    >
      <Modal.Header>
        <Text id="modal-title" size={18}>
          Delete List of Packings
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Text>Password</Text>
        <Input.Password
          placeholder="******"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button flat size="sm" onClick={onClose}>
          Close
        </Button>
        <Button
          color="error"
          size="sm"
          onClick={onConfirm}
          disabled={passwordInput !== password}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPackingsDelete;
