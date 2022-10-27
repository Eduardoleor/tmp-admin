import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { getWindowSize } from "@/utils/responsive";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, IconButton, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

type PackingsProps = {
  data: [];
  onSelectedRow: (row: {
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
  }) => void;
  onDeletedRow: (row: string) => void;
};

const PackingsTable = ({
  data,
  onSelectedRow,
  onDeletedRow,
}: PackingsProps) => {
  const [windowSize, setWindowSize] = useState(getWindowSize());

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
              onClick={() => onSelectedRow(params.row)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete-item"
              color="error"
              size="small"
              onClick={() => onDeletedRow(params.row)}
            >
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <>
      {data && data.length > 0 && (
        <Box
          style={{
            height: windowSize?.innerHeight
              ? windowSize?.innerHeight - 200
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
          <Typography>Mensaje</Typography>
          <Typography>No existen datos disponibles</Typography>
        </Box>
      )}
    </>
  );
};

export default PackingsTable;
