import { useAppSelector } from "@/store/hooks";
import { selectSnack } from "@/store/snackSlice";
import CloseIcon from "@mui/icons-material/Close";
import { Button, IconButton, Snackbar } from "@mui/material";

const Snack = () => {
  const snack = useAppSelector(selectSnack);
  const { open, message, onClose } = snack;

  return (
    <Snackbar
      open={open}
      message={message}
      onClose={onClose}
      autoHideDuration={2000}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      action={
        <>
          <Button color="primary" size="small" onClick={onClose}>
            CERRAR
          </Button>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={onClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
      }
    />
  );
};

export default Snack;
