import React, { useCallback, useEffect, useState } from "react";

import PackingsTable from "@/components/packings/PackingsTable";
import Layout from "@/components/system/Layout";
import { removeDialog, setDialog } from "@/store/dialogSlice";
import { useAppDispatch } from "@/store/hooks";
import { setSnack } from "@/store/snackSlice";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";

const PASSWORD_DELETED = "123abc";

const Main = () => {
  const dispatch = useAppDispatch();

  const [passwordDeleted, setPasswordDeleted] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [rowSelected, setRowSelected] = useState<{
    id: string;
    balloonnumber: string;
    buildsequence: string;
    linea: string;
    packingdiskno: string;
    partnumber: string;
    pono: string;
    qty: string;
    scannedby: string;
    updateat: string;
    vendorno: string;
  } | null>(null);

  const callData = useCallback(() => {
    setLoading(true);
    fetch("/api/consult-packings")
      .then((res) => res.json())
      .then((res) => {
        if (res && res.length) {
          setData(res);
        }
      })
      .catch((error) => {
        console.log(error);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    callData();
  }, [callData]);

  const handleSelectedFile = (event: any) => {
    const files = event.target.files;
    setSelectedFile(files);
  };

  const handleImportFile = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("blob", selectedFile[0], "file");
      fetch("/api/save-report", {
        method: "POST",
        body: formData,
      })
        .then((r) => r.json())
        .then(() => {
          dispatch(
            setSnack({
              open: true,
              message: "Archivo importado correctamente",
            })
          );
          callData();
        })
        .catch(() => {
          dispatch(
            setSnack({
              open: true,
              message: "Error al importar el archivo",
            })
          );
        });
    }
  };

  const handleCreateGeneralReport = () => {
    fetch("/api/create-general-report")
      .then((response) => response.blob())
      .then((blob) => {
        var file = window.URL.createObjectURL(blob);
        window.location.assign(file);
      })
      .catch((_) => {
        dispatch(
          setSnack({
            open: true,
            message: "Error al crear el reporte general",
          })
        );
      });
  };

  const handleDropGeneralReport = () => {
    dispatch(
      setDialog({
        open: true,
        title: "Eliminar reporte general",
        onClose: () => {
          dispatch(removeDialog());
        },
        primaryButtonAction: () => {
          setLoading(true);
          fetch("/api/delete-report")
            .then(() => {
              setData([]);
              callData();
            })
            .catch(() => {
              dispatch(
                setSnack({
                  open: true,
                  message: "Error al eliminar el reporte general",
                })
              );
            })
            .finally(() => setLoading(false));
        },
        body: (
          <>
            <Typography>Ingresa la contraseña</Typography>
            <TextField
              fullWidth
              id="password-deleted"
              placeholder="Contraseña"
              variant="standard"
              sx={{ mt: 2 }}
              onChange={(e) => setPasswordDeleted(e.target.value)}
            />
          </>
        ),
      })
    );
  };

  const handleDeleteRow = (item: any) => {
    const { partnumber, packingdiskno } = item;
    setLoading(true);
    fetch(`/api/delete-row?part=${partnumber}&packing=${packingdiskno}`)
      .then(() => callData())
      .catch(() => {
        dispatch(
          setSnack({
            open: true,
            message:
              "Existe un error al eliminar el elemento, intenta de nuevo",
          })
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (rowSelected) {
      dispatch(
        setDialog({
          open: true,
          title: "Editar registro",
          onClose: () => {
            dispatch(removeDialog());
            setRowSelected(null);
          },
          primaryButtonAction: () => {
            setLoading(true);
            fetch(
              `/api/update-row?id=${rowSelected.id}&balloonnumber=${rowSelected.balloonnumber}&buildsequence=${rowSelected.buildsequence}&linea=${rowSelected.linea}&packingdiskno=${rowSelected.packingdiskno}&partnumber=${rowSelected.partnumber}&pono=${rowSelected.pono}&qty=${rowSelected.qty}&vendorno=${rowSelected.vendorno}&scannedby=${rowSelected.scannedby}&updateat=${rowSelected.updateat}`
            )
              .then(() => {
                dispatch(removeDialog());
                setRowSelected(null);
                callData();
              })
              .catch(() => {
                dispatch(
                  setSnack({
                    open: true,
                    message: "Existe un error, intenta de nuevo",
                  })
                );
              })
              .finally(() => setLoading(false));
          },
          body: (
            <>
              <TextField
                fullWidth
                disabled
                margin="dense"
                id="id"
                label="ID"
                variant="standard"
                value={rowSelected?.id}
                style={{ marginTop: 20 }}
                onChange={(e) =>
                  setRowSelected((prevState: any) => ({
                    ...prevState,
                    id: e.target.value,
                  }))
                }
              />
              <TextField
                fullWidth
                margin="dense"
                id="balloonnumber"
                label="Ballon Number"
                variant="standard"
                value={rowSelected?.balloonnumber}
                style={{ marginTop: 20 }}
                onChange={(e) =>
                  setRowSelected((prevState: any) => ({
                    ...prevState,
                    balloonnumber: e.target.value,
                  }))
                }
              />
              <TextField
                fullWidth
                margin="dense"
                id="buildsequence"
                label="Build Sequence"
                variant="standard"
                value={rowSelected?.buildsequence}
                style={{ marginTop: 20 }}
                onChange={(e) =>
                  setRowSelected((prevState: any) => ({
                    ...prevState,
                    buildsequence: e.target.value,
                  }))
                }
              />
              <TextField
                fullWidth
                margin="dense"
                id="linea"
                label="Linea"
                variant="standard"
                value={rowSelected?.linea}
                style={{ marginTop: 20 }}
                onChange={(e) =>
                  setRowSelected((prevState: any) => ({
                    ...prevState,
                    linea: e.target.value,
                  }))
                }
              />
              <TextField
                fullWidth
                disabled
                margin="dense"
                id="packingdiskno"
                label="Packing Disk No."
                variant="standard"
                value={rowSelected?.packingdiskno}
                style={{ marginTop: 20 }}
                onChange={(e) =>
                  setRowSelected((prevState: any) => ({
                    ...prevState,
                    packingdiskno: e.target.value,
                  }))
                }
              />
              <TextField
                fullWidth
                margin="dense"
                id="partnumber"
                label="Part Number"
                variant="standard"
                value={rowSelected?.partnumber}
                style={{ marginTop: 20 }}
                onChange={(e) =>
                  setRowSelected((prevState: any) => ({
                    ...prevState,
                    partnumber: e.target.value,
                  }))
                }
              />
              <TextField
                fullWidth
                margin="dense"
                id="pono"
                label="PO No."
                variant="standard"
                value={rowSelected?.pono}
                style={{ marginTop: 20 }}
                onChange={(e) =>
                  setRowSelected((prevState: any) => ({
                    ...prevState,
                    pono: e.target.value,
                  }))
                }
              />
              <TextField
                fullWidth
                margin="dense"
                id="qty"
                label="Quanity"
                variant="standard"
                value={rowSelected?.qty}
                style={{ marginTop: 20 }}
                onChange={(e) =>
                  setRowSelected((prevState: any) => ({
                    ...prevState,
                    qty: e.target.value,
                  }))
                }
              />
              <TextField
                fullWidth
                margin="dense"
                id="vendorno"
                label="Vendor No."
                variant="standard"
                value={rowSelected?.vendorno}
                style={{ marginTop: 20 }}
                onChange={(e) =>
                  setRowSelected((prevState: any) => ({
                    ...prevState,
                    vendorno: e.target.value,
                  }))
                }
              />
              <TextField
                fullWidth
                margin="dense"
                id="scannedby"
                label="Scanned By"
                variant="standard"
                value={rowSelected?.scannedby}
                style={{ marginTop: 20 }}
                onChange={(e) =>
                  setRowSelected((prevState: any) => ({
                    ...prevState,
                    scannedby: e.target.value,
                  }))
                }
              />
              <TextField
                fullWidth
                disabled
                margin="dense"
                id="updateat"
                label="Update At"
                variant="standard"
                value={rowSelected?.updateat}
                style={{ marginTop: 20 }}
                onChange={(e) =>
                  setRowSelected((prevState: any) => ({
                    ...prevState,
                    updateat: e.target.value,
                  }))
                }
              />
            </>
          ),
        })
      );
    }
  }, [callData, dispatch, rowSelected]);

  if (error) {
    return (
      <Box
        bgcolor="#fafafa"
        width="100%"
        height="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h6">Existe un error 🚩</Typography>
        <Typography>Intenta de nuevo o intenta más tarde.</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        bgcolor="#fafafa"
        width="100%"
        height="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" mt={2}>
          Cargando...
        </Typography>
      </Box>
    );
  }

  return (
    <Layout>
      <Container>
        <AppBar color="primary" position="static">
          <Toolbar>
            <Typography>
              TMP | <b>Administrador</b>
            </Typography>
          </Toolbar>
        </AppBar>
        <Box my={2}>
          <input
            type="file"
            name="file"
            className="custom-file-input"
            id="inputGroupFile"
            required
            onChange={handleSelectedFile}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
        </Box>
        <Box display="flex" flexDirection="row" my={3} gap={5}>
          <Button
            fullWidth
            disabled={!selectedFile}
            color={data.length ? "info" : "primary"}
            variant="contained"
            onClick={handleImportFile}
            sx={{ gap: 2 }}
          >
            <FileUploadIcon />
            {data.length > 0 ? "Actualizar Reporte" : "Importar Reporte"}
          </Button>
          <Button
            fullWidth
            disabled={!data.length}
            variant="contained"
            color="primary"
            onClick={handleCreateGeneralReport}
            sx={{ gap: 2 }}
          >
            <FileDownloadIcon />
            Descargar reporte general (CSV)
          </Button>
          <Button
            fullWidth
            disabled={!data.length}
            variant="contained"
            color="inherit"
            onClick={handleDropGeneralReport}
            sx={{ gap: 2 }}
          >
            <GppMaybeIcon />
            Eliminar reporte
          </Button>
        </Box>
        <PackingsTable
          data={data as any}
          onSelectedRow={setRowSelected}
          onDeletedRow={handleDeleteRow}
        />
      </Container>
    </Layout>
  );
};

export default Main;
