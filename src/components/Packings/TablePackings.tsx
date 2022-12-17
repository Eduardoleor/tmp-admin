import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useSnackbar } from "react-simple-snackbar";

import { EditIcon } from "@/components/Icons//EditIcon";
import { DeleteIcon } from "@/components/Icons/DeleteIcon";
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

type Packing = {
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
};

type TablePackingsProps = {
  onSetData: (data: Packing) => void;
  onEditPacking: (data: Packing) => void;
};

const TablePackings = ({ onSetData, onEditPacking }: TablePackingsProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState<[] | any>([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const getPackings = useCallback(() => {
    setLoading(true);
    axios("/api/packings/list")
      .then((res) => {
        const sortedIPackings = res.data?.data?.sort((p1: any, p2: any) =>
          p1.id < p2.id ? 1 : p1.id > p2.id ? -1 : 0
        );
        onSetData(sortedIPackings);
        setData(sortedIPackings);
      })
      .catch((err) => setError(err.response?.data?.message))
      .finally(() => setLoading(false));
  }, [onSetData]);

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
                <IconButton
                  onClick={() => {
                    onEditPacking(packing);
                  }}
                >
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
    return data.filter(
      (packing: any) => {
        return Object.keys(packing).some((key) => {
          return String(packing[key]).toLowerCase().includes(searchTerm);
        });
      },
      [searchTerm, data]
    );
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

  return (
    <>
      {!loading && data.length > 0 && (
        <>
          <Divider css={{ my: 30 }} />
          <Text b css={{ mt: 100 }}>
            Total Packings List Items: {data.length?.toLocaleString("es-MX")}
          </Text>
          <Input
            fullWidth
            clearable
            bordered
            autoComplete="new-password"
            labelPlaceholder="Search Packing"
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
    </>
  );
};

export default TablePackings;
