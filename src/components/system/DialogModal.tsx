import { selectDialog } from "@/store/dialogSlice";
import { useAppSelector } from "@/store/hooks";
import { Button, Modal, Text } from "@nextui-org/react";

const DialogModal = () => {
  const dialog = useAppSelector(selectDialog);

  const {
    open,
    onClose,
    title,
    subtitle,
    body,
    secondaryButtonAction,
    secondaryButtonText,
    primaryButtonAction,
    primaryButtonText,
  } = dialog;

  return (
    <Modal blur aria-labelledby="modal-title" open={open} onClose={onClose}>
      <Modal.Header>
        <Text id="modal-title" size={18}>
          {title}
        </Text>
        <Text id="modal-title" size={15}>
          {subtitle}
        </Text>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button
          auto
          flat
          color="error"
          onClick={secondaryButtonAction ?? onClose}
        >
          {secondaryButtonText ?? "Cerrar"}
        </Button>
        <Button auto onClick={primaryButtonAction ?? onClose}>
          {primaryButtonText ?? "Aceptar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DialogModal;
