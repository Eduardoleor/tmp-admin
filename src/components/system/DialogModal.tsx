import { selectDialog } from "@/store/dialogSlice";
import { useAppSelector } from "@/store/hooks";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

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
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {subtitle}
        </DialogContentText>
      </DialogContent>
      <Box sx={{ mx: 3 }}>{body}</Box>
      <DialogActions>
        <Button onClick={secondaryButtonAction ?? onClose}>
          {secondaryButtonText?.length ?? "Cancelar"}
        </Button>
        <Button onClick={primaryButtonAction}>
          {primaryButtonText?.length ?? "Confirmar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogModal;
