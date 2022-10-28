import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useSnackbar } from "react-simple-snackbar";

import { EditIcon } from "@/components/Icons//EditIcon";
import { DeleteIcon } from "@/components/Icons/DeleteIcon";
import ModalPackingsDelete from "@/components/packings/ModalPackingsDelete";
import ModalPackingsUpdate from "@/components/packings/ModalPackingsUpdate";
import TablePackingsActions from "@/components/packings/TablePackingsActions";
import { Box } from "@/components/system/Box";
import { IconButton } from "@/components/system/IconButton";
import {
  Col,
  Divider,
  Input,
  Loading,
  Row,
  Table,
  Text,
  Tooltip,
} from "@nextui-org/react";

const TablePackings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState<[] | any>([]);
  const [fileSelected, setFileSelected] = useState<File[] | null>(null);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [packingSelected, setPackingSelected] = useState<{
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

  const [openSnackbar] = useSnackbar();

  const columns = [
    { name: "ID", uid: "id" },
    { name: "Part Number", uid: "partnumber" },
    { name: "Build Sequence", uid: "buildsequence" },
    { name: "Ballon Number", uid: "balloonnumber" },
    { name: "Vendor No.", uid: "vendorno" },
    { name: "Packing Disk No.", uid: "packingdiskno" },
    { name: "Update At", uid: "updateat" },
    { name: "Scanned By", uid: "scannedby" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const getPackings = () => {
    setLoading(true);
    axios("/api/packings/list")
      .then((res) => {
        const sortedIPackings = res.data?.data?.sort((p1: any, p2: any) =>
          p1.id < p2.id ? 1 : p1.id > p2.id ? -1 : 0
        );
        setData(sortedIPackings);
      })
      .catch((err) => setError(err.response?.data?.message))
      .finally(() => setLoading(false));
  };

  const handleUpload = () => {
    if (fileSelected) {
      setLoading(true);

      const formData = new FormData();
      formData.append("blob", fileSelected[0], "file");

      axios({
        method: "post",
        url: "/api/packings/upload",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then((res) => {
          openSnackbar(res.data?.message);
          getPackings();
        })
        .catch((err) => openSnackbar(err.response?.data?.message))
        .finally(() => setLoading(false));
    }
  };

  const handleDownload = () => {
    setLoading(true);
    axios("/api/packings/download", { responseType: "blob" })
      .then((res) => {
        const file = window.URL.createObjectURL(res.data);
        window.location.assign(file);
        openSnackbar("Downloaded successfully");
      })
      .catch((err) => openSnackbar(err.response?.data?.message))
      .finally(() => setLoading(false));
  };

  const handleDelete = () => {
    setLoading(true);
    axios
      .delete("/api/packings/delete")
      .then((res) => {
        openSnackbar(res.data?.message);
        setOpenModalDelete(false);
        getPackings();
      })
      .catch((err) => openSnackbar(err.response?.data?.message))
      .finally(() => setLoading(false));
  };

  const handleUpdate = () => {
    setLoading(true);
    axios
      .put("/api/packings/table/update", null, { params: packingSelected })
      .then((res) => {
        openSnackbar(res.data?.message);
        setOpenModalEdit(false);
        getPackings();
      })
      .catch((err) => {
        openSnackbar(err.response?.data?.message);
        setOpenModalEdit(false);
      })
      .finally(() => setLoading(false));
  };

  const handleDeletePackingRow = (part: number, packing: number) => {
    setLoading(true);

    const params = {
      part,
      packing,
    };

    axios
      .delete("/api/packings/table/delete", { params })
      .then((res) => {
        openSnackbar(res.data?.message);
        getPackings();
      })
      .catch((err) => openSnackbar(err.response?.data?.message))
      .finally(() => setLoading(false));
  };

  const handleUpdatPackingRow = (packing: any) => {
    setOpenModalEdit(true);
    setPackingSelected(packing);
  };

  const renderCell = (packing: any, columnKey: any) => {
    const cellValue = packing[columnKey];
    switch (columnKey) {
      case "id":
        return (
          <Col>
            <Row>
              <Tooltip content={cellValue} color="invert">
                <Text>{cellValue.slice(0, 5)}</Text>
              </Tooltip>
            </Row>
          </Col>
        );
      case "updateat":
        return (
          <Col>
            <Row>
              <Tooltip content={cellValue} color="invert">
                <Text>{dayjs(cellValue).format("DD/MM/YYYY")}</Text>
              </Tooltip>
            </Row>
          </Col>
        );
      case "actions":
        return (
          <Row justify="center" align="center">
            <Col css={{ d: "flex" }}>
              <Tooltip content="Edit Packing">
                <IconButton onClick={() => handleUpdatPackingRow(packing)}>
                  <EditIcon size={20} fill="#979797" />
                </IconButton>
              </Tooltip>
            </Col>
            <Col css={{ d: "flex" }}>
              <Tooltip
                content="Delete Packing"
                color="error"
                onClick={() =>
                  handleDeletePackingRow(
                    packing.partnumber,
                    packing.packingdiskno
                  )
                }
              >
                <IconButton>
                  <DeleteIcon size={20} fill="#FF0080" />
                </IconButton>
              </Tooltip>
            </Col>
          </Row>
        );
      default:
        return cellValue;
    }
  };

  const filteredRows = useMemo(() => {
    if (!searchTerm) return data;

    if (data.length > 0) {
      const attributes = Object.keys(data[0] as any);
      const list: any = [];
      for (const current of data as any) {
        for (const attribute of attributes) {
          if (attribute === "key") {
            continue;
          }
          const value: any = current[attribute];
          if (value && value.toLowerCase() === searchTerm.toLowerCase()) {
            const found = data.find((row: any) => row.key === current.key);
            if (found) {
              list.push(found);
            }
          }
        }
      }
      return list;
    }

    return [];
  }, [searchTerm, data]);

  useEffect(() => {
    getPackings();
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
        <Loading size="lg">Loading...</Loading>
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

  return (
    <>
      <TablePackingsActions
        onUpdate={handleUpload}
        onDownload={handleDownload}
        onDelete={() => setOpenModalDelete(true)}
        onSelectedFile={(file) => setFileSelected(file)}
        fileSelected={fileSelected}
        data={data}
      />
      {!loading && data.length > 0 && (
        <>
          <Divider css={{ my: 30 }} />
          <Text b css={{ mt: 100 }}>
            Total Packings List Items: {data.length}
          </Text>
          <Input
            fullWidth
            clearable
            bordered
            labelPlaceholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            css={{ my: 35 }}
          />
        </>
      )}
      {!loading && data.length > 0 ? (
        <Table
          lined
          aria-label="table-packings"
          selectionMode="single"
          aria-sort="ascending"
          sortDescriptor={{ column: "id", direction: "ascending" }}
          css={{
            height: "auto",
            minWidth: "100%",
          }}
        >
          <Table.Header columns={columns}>
            {(column) => (
              <Table.Column
                key={column.uid}
                hideHeader={column.uid === "actions"}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </Table.Column>
            )}
          </Table.Header>
          <Table.Body items={filteredRows}>
            {(item) => (
              <Table.Row>
                {(columnKey) => (
                  <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
                )}
              </Table.Row>
            )}
          </Table.Body>
          <Table.Pagination shadow noMargin align="center" rowsPerPage={30} />
        </Table>
      ) : (
        <Text>Not found packings</Text>
      )}
      <ModalPackingsDelete
        open={openModalDelete}
        onClose={() => setOpenModalDelete(false)}
        onConfirm={handleDelete}
        password={process.env.NEXT_PUBLIC_ADMIN_PASSWORD as string}
      />
      <ModalPackingsUpdate
        open={openModalEdit}
        onClose={() => {
          setOpenModalEdit(false);
          setPackingSelected(null);
        }}
        onConfirm={handleUpdate}
        onUpdate={setPackingSelected}
        packing={packingSelected}
      />
    </>
  );
};

export default TablePackings;
