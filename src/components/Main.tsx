import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useCallback, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";
import dayjs from "dayjs";

const PASSWORD_DELETED = "123abc";
const getWindowSize = () => {
  if (typeof window !== "undefined") {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }
};

const Main = () => {
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openDeleted, setOpenDeleted] = useState(false);
  const [passwordDeleted, setPasswordDeleted] = useState("");
  const [openDetails, setOpenDetails] = useState(false);
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  const callData = useCallback(() => {
    setLoading(true);
    fetch("/api/consult-packings")
      .then((res) => res.json())
      .then((res) => {
        if (res && res.length) {
          const items = res.map((item: any, index: number) => {
            return {
              id: index + 1,
              ...item,
            };
          });
          setData(items);
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

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

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
          setSnackbar({
            open: true,
            message: "Archivo importado correctamente",
          });
          setTimeout(() => {
            setSnackbar({
              open: false,
              message: "",
            });
          }, 3500);
          callData();
        })
        .catch(() => {
          setSnackbar({
            open: true,
            message: "Existe un error, intenta de nuevo",
          });
        });
    }
    setSnackbar({
      open: true,
      message: "Debes seleccionar un archivo primero",
    });
  };

  const handleCreateGeneralReport = () => {
    fetch("/api/create-general-report")
      .then((response) => response.blob())
      .then((blob) => {
        var file = window.URL.createObjectURL(blob);
        window.location.assign(file);
      })
      .catch((err) => {
        setSnackbar({
          open: true,
          message: "Existe un error, intenta de nuevo",
        });
        console.log(err);
      });
  };

  const handleConfirmDelete = () => {
    setOpenDeleted(true);
  };

  const handleDeleteReport = () => {
    setOpenDeleted(false);
    setLoading(true);
    fetch("/api/delete-report")
      .then(() => {
        setData([]);
        callData();
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Existe un error, intenta de nuevo",
        });
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteItem = (item: any) => {
    const { partnumber, packingdiskno } = item;
    setLoading(true);
    fetch(`/api/delete-row?part=${partnumber}&packing=${packingdiskno}`)
      .then(() => callData())
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Existe un error, intenta de nuevo",
        });
      })
      .finally(() => setLoading(false));
  };

  const handleSelectedRow = (row: any) => {
    setRowSelected(row);
    setOpenDetails(true);
  };

  const handleUpdateRow = () => {
    if (rowSelected) {
      setLoading(true);
      fetch(
        `/api/update-row?id=${rowSelected.id}&balloonnumber=${rowSelected.balloonnumber}&buildsequence=${rowSelected.buildsequence}&linea=${rowSelected.linea}&packingdiskno=${rowSelected.packingdiskno}&partnumber=${rowSelected.partnumber}&pono=${rowSelected.pono}&qty=${rowSelected.qty}&vendorno=${rowSelected.vendorno}&scannedby=${rowSelected.scannedby}&updateat=${rowSelected.updateat}`
      )
        .then(() => {
          setOpenDetails(false);
          callData();
        })
        .catch(() => {
          setSnackbar({
            open: true,
            message: "Existe un error, intenta de nuevo",
          });
        })
        .finally(() => setLoading(false));
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      sortable: false,
    },
    {
      field: "partnumber",
      headerName: "Part Number",
      width: 200,
      editable: false,
      sortable: false,
    },
    {
      field: "buildsequence",
      headerName: "Build Sequence",
      width: 150,
      editable: false,
      sortable: false,
    },
    {
      field: "balloonnumber",
      headerName: "Ballon Number",
      width: 150,
      editable: false,
      sortable: false,
    },
    { field: "qty", headerName: "Quantity", editable: false, sortable: false },
    { field: "pono", headerName: "PO No.", editable: false, sortable: false },
    {
      field: "vendorno",
      headerName: "Vendor No.",
      editable: false,
      sortable: false,
    },
    {
      field: "packingdiskno",
      headerName: "Packing Disk No.",
      width: 150,
      editable: false,
      sortable: false,
    },
    { field: "linea", headerName: "Linea", editable: false, sortable: false },
    {
      field: "updateat",
      headerName: "Update At",
      width: 200,
      editable: false,
      sortable: false,
      type: "date",
      valueFormatter: (params) => dayjs(params?.value).format("DD/MM/YYYY"),
    },
    {
      field: "scannedby",
      headerName: "Scanned By",
      editable: false,
      sortable: false,
    },
    {
      field: "actions",
      headerName: "Actions",
      editable: false,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              aria-label="edit-item"
              color="info"
              size="small"
              onClick={() => handleSelectedRow(params.row)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete-item"
              color="error"
              size="small"
              onClick={() => handleDeleteItem(params.row)}
            >
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

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
          onClick={handleConfirmDelete}
          sx={{ gap: 2 }}
        >
          <GppMaybeIcon />
          Eliminar reporte
        </Button>
      </Box>
      {data && data.length > 0 && (
        <Box
          style={{
            height: windowSize?.innerHeight
              ? windowSize?.innerHeight - 250
              : 500,
            width: "100%",
          }}
        >
          <DataGrid
            rows={data}
            columns={columns}
            pageSize={50}
            rowsPerPageOptions={[50]}
            checkboxSelection={false}
            disableSelectionOnClick
            sortModel={[
              {
                field: "id",
                sort: "asc",
              },
            ]}
          />
        </Box>
      )}
      {!data.length && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: windowSize?.innerHeight
              ? windowSize?.innerHeight - 350
              : 400,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Typography>ℹ️</Typography>
          <Typography>No existen datos disponibles</Typography>
        </Box>
      )}
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        onClose={() => setSnackbar({ open: false, message: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        action={
          <React.Fragment>
            <Button
              color="primary"
              size="small"
              onClick={() => setSnackbar({ open: false, message: "" })}
            >
              CERRAR
            </Button>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => setSnackbar({ open: false, message: "" })}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
      <Dialog
        fullWidth
        open={openDetails}
        onClose={() => setOpenDetails(false)}
      >
        <DialogTitle>Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Packing ID: {rowSelected?.packingdiskno}
          </DialogContentText>
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
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setOpenDetails(false)}>
            Cancelar
          </Button>
          <Button onClick={() => handleUpdateRow()}>Actualizar</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDeleted} onClose={() => setOpenDeleted(false)}>
        <DialogTitle>Confirmar eliminiación</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Esta acción eliminará toda la información actualizada.
          </DialogContentText>
          <TextField
            fullWidth
            id="password-deleted"
            placeholder="Contraseña"
            variant="standard"
            sx={{ mt: 2 }}
            onChange={(e) => setPasswordDeleted(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleted(false)}>Cancelar</Button>
          <Button
            disabled={PASSWORD_DELETED !== passwordDeleted}
            color="error"
            onClick={() => handleDeleteReport()}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Main;
